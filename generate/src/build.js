import { STEVE, SiteGenerator, SingleRoute, GeneratorRoute, readDirectoryAsStrings } from 'steve-template-engine';
import { marked } from 'marked';
import { parse } from 'node-html-parser';
import LOGGER from './logger.js';

// checks for @ at the start of a line to center content if needed
const centerable = {
    name: 'centeralign',
    level: 'block',
    start(source) { return source.match(/@[^@\n]/)?.index },
    tokenizer(source, tokens) {
        const rule = /^(?:@[^@\n]*(?:\n|$))+/;
        const match = rule.exec(source);
        if (match) {
            let content = match[0]
                .split(/\n/)
                .filter(line => line != '')
                .map(line => {
                    return ' ' + /^@([^@\n]+)(?:\n|$)/.exec(line)[1];
                }).join('\n');

            const token = {
                type: 'centeralign',
                raw: content,
                text: content.trim(),
                tokens: []
            };

            this.lexer.inline(token.text, token.tokens);
            return token;
        }
    },
    renderer(token) {
        return `<div style="text-align: center;">${this.parser.parseInline(token.tokens)}\n</div>`;
    }
}

marked.use({ extensions: [centerable] });

const convertMarkdown = content => {
    const [data, ...file] = content.split('\n');
    let parsedFile = marked.parse(STEVE.render(file.join('\n')));
    parsedFile = parsedFile.replace(/[%]/g, '%25');
    return { data: JSON.parse(data), content: decodeURI(parsedFile) };
}

const generateSite = outputDirectory => {
    STEVE.includeDirectory = './generate/src/pages/includes';
    STEVE.addPlugin(new SiteGenerator({
        staticDirectory: './generate/src/static',
        outputDirectory: outputDirectory,
        ignoredFiles: ['generate', 'README.md'],
        showExtension: false
    }));

    // generate posts
    let posts = [];

    let postInfo = Object.entries(readDirectoryAsStrings('./generate/src/posts'));
    for (let i = 0; i < postInfo.length; i++) {
        const filename = postInfo[i][0], content = postInfo[i][1];
        const results = convertMarkdown(content);
        posts.push({ name: filename.replace(/\//g, '.'), data: { content: results.content, textOnly: parse(results.content).innerText, ...results.data } });
    }

    posts.sort((a, b) => {
        return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
    });

    STEVE.generate({
        root: new SingleRoute({ render: './generate/src/pages/home.steve', data: { posts }, isFile: true }),
        contact: new SingleRoute({ render: './generate/src/pages/contact.steve', data: {}, isFile: true }),
        blog: {
            root: new SingleRoute({ render: './generate/src/pages/blog/blog_main.steve', data: { posts }, isFile: true }),
            posts: new GeneratorRoute({ render: './generate/src/pages/blog/post.steve', data: {}, isFile: true, generator: posts })
        },
        projects: new SingleRoute({ render: './generate/src/pages/projects_main.steve', data: {}, isFile: true })
    });

    LOGGER.info(`codingap.github.io was generated`);
}

export { generateSite };