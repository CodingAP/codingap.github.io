import { DOMParser } from '@b-fuze/deno-dom';
import {
    GeneratorRoute,
    SingleRoute,
    SiteGenerator,
    STEVE,
} from '@codingap/steve';
import { Renderer } from '@libs/markdown';
import directives, { directive, h } from '@libs/markdown/plugins/directives';
import frontmatter from '@libs/markdown/plugins/frontmatter';
import highlighting from '@libs/markdown/plugins/highlighting';
import { walk } from '@std/fs';
import { unescape } from '@std/html';
import { basename, join, relative, resolve } from '@std/path';

interface PostData {
    title: string;
    author: string;
    date: string;
}

const custom = directive((node) => {
    if (node.type === 'containerDirective' && node.name === 'center') {
        node.data ??= {};
        node.data.hName = 'div';
        node.data.hProperties =
            h(node.data.hName, { style: 'text-align: center;' }).properties;
    }

    if (node.type === 'leafDirective' && node.name === 'image') {
        node.data ??= {};
        const src = node.attributes?.src ?? '';
        const style = node.attributes?.style ?? '';

        if (!src) {
            throw new Error("The 'image' markdown requires a 'url' attribute.");
        }

        node.data.hName = 'div';
        node.data.hProperties =
            h('div', { style: 'text-align: center; padding-bottom: 20px;' }).properties;
        node.data.hChildren = [
            {
                type: 'element',
                tagName: 'img',
                properties: {
                    src: `<steve> return steve.staticFile('${src}'); </steve>`,
                    style,
                },
                children: [],
            },
        ];
    }
});

const currentDirectory = resolve('./');
const customRenderer = new Renderer({
    plugins: [frontmatter, highlighting, directives, custom],
});

const convertMarkdown = async (
    content: string,
): Promise<{ data: PostData; content: string; textOnly: string }> => {
    const { value: parsedFile, metadata } = await customRenderer.render(
        content,
        { metadata: true },
    );

    const unescaped = unescape(parsedFile);
    return {
        data: metadata.frontmatter as PostData,
        content: STEVE.render(unescaped, {}),
        textOnly: new DOMParser().parseFromString(unescaped, 'text/html').body.innerText,
    };
};

const generateSite = async () => {
    STEVE.includeDirectory = join(currentDirectory, 'pages/includes');
    STEVE.addPlugin(
        new SiteGenerator({
            staticDirectory: join(currentDirectory, 'static'),
            ignoredFiles: [currentDirectory],
            outputDirectory: resolve(currentDirectory, '../'),
            showExtension: false,
        }),
    );

    const posts: { name: string; data: { [key: string]: string } }[] = [];
    const postDirectory = join(currentDirectory, 'posts');
    for await (const post of walk(postDirectory)) {
        if (post.isFile) {
            const filename = relative(postDirectory, post.path);
            const textContent = await Deno.readTextFile(post.path);
            const { data, content, textOnly } = await convertMarkdown(
                textContent,
            );
            posts.push({
                name: basename(filename, '.md').replace(/\//g, '.'),
                data: { content, textOnly, ...data },
            });
        }
    }

    posts.sort((a, b) => {
        return new Date(b.data.date).getTime() -
            new Date(a.data.date).getTime();
    });

    STEVE.generate({
        root: new SingleRoute({
            render: join(currentDirectory, 'pages/home.steve'),
            data: { posts },
            isFile: true,
        }),
        contact: new SingleRoute({
            render: join(currentDirectory, 'pages/contact.steve'),
            data: {},
            isFile: true,
        }),
        blog: {
            root: new SingleRoute({
                render: join(currentDirectory, 'pages/blog/blog_main.steve'),
                data: { posts },
                isFile: true,
            }),
            posts: new GeneratorRoute({
                render: join(currentDirectory, 'pages/blog/post.steve'),
                data: {},
                isFile: true,
                generator: posts,
            }),
        },
        projects: new SingleRoute({
            render: join(currentDirectory, 'pages/projects_main.steve'),
            data: {},
            isFile: true,
        }),
    });
};

export { generateSite };
