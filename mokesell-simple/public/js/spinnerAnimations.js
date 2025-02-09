// Prize wheel animation
const prizes = [
    { value: 5, label: '$5 Voucher' },
    { value: 10, label: '$10 Voucher' },
    { value: 15, label: '$15 Voucher' },
    { value: 20, label: '$20 Voucher' },
    { value: 25, label: '$25 Voucher' },
    { value: 50, label: '$50 Voucher' }
];

let wheel = document.getElementById('prizeWheel');
let ctx = wheel.getContext('2d');
const segments = prizes.length;
const arc = Math.PI * 2 / segments;

function drawWheel() {
    const radius = wheel.width / 2;
    ctx.clearRect(0, 0, wheel.width, wheel.height);

    // Draw segments
    prizes.forEach((prize, i) => {
        ctx.beginPath();
        ctx.fillStyle = i % 2 ? '#2ecc71' : '#27ae60';
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius, i * arc, (i + 1) * arc);
        ctx.lineTo(radius, radius);
        ctx.fill();

        // Add text
        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(i * arc + arc / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(prize.label, radius - 20, 5);
        ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.arc(radius, radius, 20, 0, Math.PI * 2);
    ctx.fill();
}

function spinWheel(onComplete) {
    const spins = 5;
    const randomPrize = Math.floor(Math.random() * segments);
    const totalRotation = (spins * 360) + (randomPrize * (360 / segments));
    let currentRotation = 0;
    const step = 10;
    let slowdown = 1;

    function animate() {
        const maxRotation = totalRotation;
        currentRotation += step * slowdown;
        slowdown *= 0.995;

        wheel.style.transform = `rotate(${currentRotation}deg)`;

        if (currentRotation < maxRotation) {
            requestAnimationFrame(animate);
        } else {
            onComplete(prizes[randomPrize]);
        }
    }

    animate();
}