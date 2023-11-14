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
const dialog = { width: 0.66, height: 0.4 };

const yearLineName = index => {
    if (index > 20) {
        return 'and beyond!';
    }

    return (index + 2003).toString();
}

const events = [
    {
        timeline: 1.5,
        name: 'i pooped',
        color: 'red',
        description: 'i was pooping my pants at this age idk'
    },
    {
        timeline: 11.5,
        name: 'i didn\'t pooped',
        color: 'green',
        description: 'i was constipated!'
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

        context.fillText(events[i].name, events[i].timeline * unitSize, 25);

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

        context.fillStyle = '#000';
        context.font = '50px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(events[eventSelected].description, canvas.width / 2, canvas.height / 2)
    
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