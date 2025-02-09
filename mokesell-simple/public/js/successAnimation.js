const prizeWonAnimation = {
    container: document.getElementById('successAnimation'),
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: '/success-animation.json',
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

function showPrizeWon(prize) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <div id="successAnimation" class="w-32 h-32 mx-auto mb-4"></div>
            <h2 class="text-2xl font-bold mb-4">Congratulations! 🎉</h2>
            <p class="text-lg text-gray-600 mb-6">You've won a ${prize.label}!</p>
            <p class="text-sm text-gray-500 mb-6">The voucher has been added to your account</p>
            <button onclick="this.parentElement.parentElement.remove()" 
                    class="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition-colors">
                Start Shopping
            </button>
        </div>
    `;
    document.body.appendChild(modal);
    
    const anim = lottie.loadAnimation(prizeWonAnimation);
    anim.addEventListener('complete', () => {
        // Save voucher to user's account
        saveVoucherToAccount(prize);
    });
}

async function saveVoucherToAccount(prize) {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch('/api/vouchers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                amount: prize.value,
                expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
            })
        });

        if (!response.ok) {
            throw new Error('Failed to save voucher');
        }
    } catch (error) {
        console.error('Error saving voucher:', error);
    }
}