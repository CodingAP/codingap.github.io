let mainContainer = document.querySelector('.container');
let circleContainer = document.querySelector('#circle-container');
let circleDivs = [];

let generateCircles = () => {
    let width = (document.documentElement.scrollWidth - mainContainer.clientWidth) / 2;

    for (let i = 0; i < (10 * Math.round(document.documentElement.scrollHeight / 1000)); i++) {
        let circleInfo = {
            position: { x: Math.random(), y: Math.random() },
            size: Math.random(),
            alpha: Math.random(),
            left: (i % 2 == 0),
            div: document.createElement('div') 
        };

        circleInfo.div.style.position = 'absolute';
        circleInfo.div.style.left = `${circleInfo.position.x * width + (circleInfo.left ? 0 : (mainContainer.clientWidth + width))}px`;
        circleInfo.div.style.top = `${circleInfo.position.y * (document.documentElement.scrollHeight - 100)}px`;

        circleInfo.div.style.width = `${circleInfo.size * 60 + 40}px`;
        circleInfo.div.style.aspectRatio = '1';
        circleInfo.div.style.borderRadius = '50%';
        circleInfo.div.style.backgroundColor = `rgba(42, 65, 88, ${circleInfo.alpha * 0.5 + 0.25})`;
        circleInfo.div.style.zIndex = -1;

        circleDivs.push(circleInfo);
        circleContainer.appendChild(circleInfo.div);
    }
}
const isMobile = window.matchMedia('only screen and (max-width: 768px)').matches;
if (!isMobile) generateCircles();

window.addEventListener('resize', () => {
    let width = (document.documentElement.scrollWidth - mainContainer.clientWidth) / 2;

    for (let i = 0; i < circleDivs.length; i++) {
        circleDivs[i].div.style.left = `${circleDivs[i].position.x * width + (circleDivs[i].left ? 0 : (mainContainer.clientWidth + width))}px`;
        circleDivs[i].div.style.top = `${circleDivs[i].position.y * (document.documentElement.scrollHeight - 100)}px`;
        circleDivs[i].div.style.width = `${circleDivs[i].size * 60 + 40}px`;
    }
})