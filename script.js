const flowers = document.getElementById("flowers");

// ==========================
// TULIPÁN
// ==========================
function tulip(xOffset, height, curve, delay){

const baseX = 450;   // punto único central
const baseY = 820;   // punto base único

let stemTopX = baseX + xOffset;
let stemTopY = baseY - height;

return `
<g>

    <!-- Tallo desde un solo punto -->
    <path d="
        M ${baseX} ${baseY}
        Q ${baseX + curve} ${baseY - height/2}
          ${stemTopX} ${stemTopY}
    "
    stroke="#4cc38a"
    stroke-width="5"
    fill="none"
    stroke-linecap="round"
    style="
        stroke-dasharray:500;
        stroke-dashoffset:500;
        animation:growStem 2s ease forwards;
        animation-delay:${delay}s;">
    </path>

    <!-- Flor -->
    <g opacity="0"
       style="animation:fadeIn 1s ease forwards;
              animation-delay:${delay+2}s;">

        <path d="
            M ${stemTopX} ${stemTopY}
            Q ${stemTopX-28} ${stemTopY-35}
              ${stemTopX-15} ${stemTopY-70}
            Q ${stemTopX-5} ${stemTopY-40}
              ${stemTopX} ${stemTopY}
        "
        fill="url(#tulipYellow)">
        </path>

        <path d="
            M ${stemTopX} ${stemTopY}
            Q ${stemTopX} ${stemTopY-75}
              ${stemTopX+10} ${stemTopY-35}
            Q ${stemTopX+5} ${stemTopY-40}
              ${stemTopX} ${stemTopY}
        "
        fill="#fff1a8">
        </path>

        <path d="
            M ${stemTopX} ${stemTopY}
            Q ${stemTopX+28} ${stemTopY-35}
              ${stemTopX+15} ${stemTopY-70}
            Q ${stemTopX+5} ${stemTopY-40}
              ${stemTopX} ${stemTopY}
        "
        fill="url(#tulipYellow)">
        </path>

    </g>

</g>
`;
}

// ==========================
// POSICIONES (15)
// ==========================
let positions = [
[-140,260,-40,0],
[-110,300,-20,0.2],
[-80,280,-10,0.4],
[-50,320,15,0.6],
[-20,290,25,0.8],
[0,340,0,1],
[20,310,-15,1.2],
[50,300,10,1.4],
[80,280,-20,1.6],
[110,260,20,1.8],
[-60,240,30,2],
[60,250,-30,2.2],
[-30,270,10,2.4],
[30,275,-10,2.6],
[0,230,0,2.8]
];

positions.forEach(p=>{
flowers.innerHTML += tulip(p[0],p[1],p[2],p[3]);
});

// ==========================
// PARTÍCULAS REACTIVAS
// ==========================

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.style.position="fixed";
canvas.style.top=0;
canvas.style.left=0;
canvas.style.zIndex=0;
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

const ctx = canvas.getContext("2d");

let particles=[];
for(let i=0;i<120;i++){
particles.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:Math.random()*2,
speed:Math.random()*0.5
});
}

// AUDIO API
let audioCtx;
let analyser;
let dataArray;

playBtn.addEventListener("click", ()=>{

if(!audioCtx){
audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const source = audioCtx.createMediaElementSource(music);
analyser = audioCtx.createAnalyser();
source.connect(analyser);
analyser.connect(audioCtx.destination);
analyser.fftSize = 256;
dataArray = new Uint8Array(analyser.frequencyBinCount);
}

if(music.paused){
music.play();
playBtn.textContent="Pausar";
}else{
music.pause();
playBtn.textContent="💛";
}

});

// ANIMACIÓN
function animate(){

ctx.clearRect(0,0,canvas.width,canvas.height);

let intensity = 0;

if(analyser){
analyser.getByteFrequencyData(dataArray);
intensity = dataArray[20] / 255;
}

particles.forEach(p=>{
p.y -= p.speed;
if(p.y < 0) p.y = canvas.height;

ctx.beginPath();
ctx.arc(p.x, p.y, p.size + intensity*5, 0, Math.PI*2);
ctx.fillStyle = "rgba(255,255,255,0.7)";
ctx.fill();
});

document.body.style.background = `radial-gradient(circle at top, rgba(26,39,64,${1-intensity*0.5}), #0a0f1c)`;

requestAnimationFrame(animate);
}

animate();