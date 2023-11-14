const distance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

let mouse = { button: -1, position: { x: 0, y: 0 } };
let progress = 0, selected = false;
let eventSelected = -1;

window.addEventListener('load', () => {
    resize();
    window.requestAnimationFrame(loop);
});

window.addEventListener('resize', () => {
    resize();
});

const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// mouse events
window.addEventListener('mousedown', event => {
    mouse.button = event.button;
    mouse.position.x = event.clientX;
    mouse.position.y = event.clientY;
});

window.addEventListener('mouseup', event => {
    mouse.button = -1;
    mouse.position.x = event.clientX;
    mouse.position.y = event.clientY;
});

window.addEventListener('mousemove', event => {
    mouse.position.x = event.clientX;
    mouse.position.y = event.clientY;
});

// drawing constants
const margin = { x: 100, y: 50 };
const barHeight = 30;
const scrollingUnits = 21;
const unitSize = 500;
const dialog = { width: 0.8, height: 0.66 };

const yearLineName = index => {
    if (index > 20) {
        return 'and beyond!';
    }

    return (index + 2003).toString();
}

const events = [
    {
        timeline: 7.75,
        name: 'September 2010; 3rd Grade',
        color: 'red',
        description:
            `I was a smart cookie, so I was very good at those speed math tests (do 30
problems in a minute, stuff like that). I was so good and enthralled that I decided to go all
the way and finish the add/subtract section, followed by the multiply/divide section.
However, a new format appeared that I couldn't recognize (I would later learn it to be the
exponent). The question was 15^2. I started it by doing what I normally do with
multiplication and got 30, which was wrong. I first tried to assimilate what it was before
asking my teacher what it was, which made me have to accommodate the fact that
exponent's was multiplication but with the number itself. The upper number indicates
how many times I had to multiply it, so the correct answer was 225.`
    },
    {
        timeline: 4.75,
        name: 'Late 2007; Preschool',
        color: 'green',
        description:
            `My event was in preschool in 2007 when I was 4 years old. We needed to clean up after
playtime because we were messy children, but I just wanted to sing the song, no clean
up. While walking around and singing, the other students noticed that I wasn't doing
much. One even clued in the teacher, who didn't do much at the start, but quickly asked
what I was doing when I sat down. Me, a very young child who didn't want to get in
trouble, started to help, but it was too late. The play area was already clean, so there
was nothing I could do. The ZPD comes from looking at the other students cleaning up
and the teacher not getting on to them, so I learned cleaning up was good.`
    },
    {
        timeline: 21,
        name: 'Summary',
        color: 'blue',
        description:
            `Lots of my experiences consisted of social interactions between peers or my family. Those, I
think, were the real shapers of my life and education. Most of the time, I would learn something
from someone, which would build off everything, and then I would “teach” it to someone, which
made my education grow even more.`
    }
]

const loop = () => {
    context.fillStyle = '#aaa';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // draw progress bar
    const barWidth = canvas.width - margin.x * 2;

    context.lineWidth = 3;
    context.strokeStyle = '#000';
    context.fillStyle = '#fff';
    context.fillRect(margin.x, canvas.height - margin.y - barHeight, barWidth, barHeight);
    context.fillStyle = '#f00';
    context.fillRect(margin.x, canvas.height - margin.y - barHeight, barWidth * progress, barHeight);
    context.strokeRect(margin.x, canvas.height - margin.y - barHeight, barWidth, barHeight);

    const progressCircle = { x: margin.x + (progress * barWidth), y: canvas.height - margin.y - barHeight / 2 };

    context.fillStyle = '#000';
    context.beginPath();
    context.arc(progressCircle.x, progressCircle.y, barHeight, 0, Math.PI * 2);
    context.closePath();
    context.fill();

    // draw scrolling stuff
    context.save();

    let scroll = { x: canvas.width / 2 - progress * unitSize * scrollingUnits, y: canvas.height / 2 };
    context.translate(scroll.x, scroll.y);

    context.strokeStyle = '#000';
    context.font = '30px Arial';
    context.textAlign = 'left';
    context.textBaseline = 'hanging';
    for (let i = 0; i <= scrollingUnits; i++) {
        context.beginPath();
        context.moveTo(i * unitSize, -30);
        context.lineTo(i * unitSize, 30);
        context.closePath();
        context.stroke();

        context.fillText(yearLineName(i), i * unitSize, 40);
    }
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(scrollingUnits * unitSize, 0);
    context.closePath();
    context.stroke();

    for (let i = 0; i < events.length; i++) {
        let eventPosition = { x: events[i].timeline * unitSize, y: 0 };

        context.fillStyle = events[i].color;
        context.beginPath();
        context.arc(eventPosition.x, eventPosition.y, 20, 0, Math.PI * 2);
        context.closePath();
        context.fill();

        context.fillText(events[i].name, events[i].timeline * unitSize, -50);

        let translatedEventPosition = { x: eventPosition.x + scroll.x, y: eventPosition.y + scroll.y };

        if (mouse.button == 0) {
            if (distance(mouse.position, translatedEventPosition) < 20) {
                eventSelected = i;
                mouse.button = -1;
            }
        }
    }

    context.restore();

    // render description
    if (eventSelected != -1) {
        context.save();
        context.globalAlpha = 0.5;
        context.fillStyle = '#000';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.restore();

        const description = {
            x: (canvas.width - dialog.width * canvas.width) / 2,
            y: ((canvas.height - dialog.height * canvas.height) / 2),
            width: dialog.width * canvas.width,
            height: dialog.height * canvas.height
        };

        context.fillStyle = '#aaa';
        context.fillRect(description.x, description.y, description.width, description.height);

        let lines = events[eventSelected].description.split('\n');
        context.fillStyle = '#000';
        context.font = '20px Arial';
        context.textAlign = 'left';
        context.textBaseline = 'top';
        for (let i = 0; i < lines.length; i++) {
            context.fillText(lines[i], description.x + 10, description.y + 10 + (i * 20));
        }

        if (!(mouse.position.x > description.x && mouse.position.x < description.x + description.width &&
            mouse.position.y > description.y && mouse.position.y < description.y + description.height) && mouse.button == 0) {
            eventSelected = -1;
        }
    } else {
        // update progress bar
        if (mouse.button == 0) {
            if (distance(mouse.position, progressCircle) < barHeight) {
                selected = true;
            }
        } else if (mouse.button == -1) {
            selected = false;
        }

        if (selected) {
            progress = clamp((mouse.position.x - margin.x) / barWidth, 0, 1);
        }
    }

    window.requestAnimationFrame(loop);
}