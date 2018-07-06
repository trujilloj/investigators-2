const publicStripeKey = 'pk_test_elpOWvia2H76jHTpdf3Y2LXe';
const purchaseData = {
    amount: 0
};

var handler = StripeCheckout.configure({
    key: publicStripeKey,
    image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
    locale: 'auto',
    token: function (token) {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
        const payload = {
            stripeToken: token.id,
            amount: purchaseData.amount
        }
        fetch('http://localhost:5000/accept-payment', {
                method: 'post',
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(res => {
                const paidStatus = document.querySelector('#paidStatus');
                console.log(res)
                if (res.failure_code) {
                    displayError(new Error('There was an error processing your card', paidStatus))
                } else {
                    const message = `Your card was charged $${res.amount / 100}`
                    paidStatus.innerHTML = message;
                }
            })
            .catch(displayError)
    }
});

document.querySelector('#pay-bill').addEventListener('submit', function (e) {
    // Open Checkout with further options:
    e.preventDefault();
    const form = new FormData(e.target);
    const pennies = Number(form.get('amount'));
    const amount = pennies * 100;

    purchaseData.amount = amount;

    if (amount) {
        handler.open({
            name: 'Galvanize Membership',
            description: 'Pay Membership Fee',
            amount
        });
    }
});

// Close Checkout on page navigation:
window.addEventListener('popstate', function () {
    handler.close();
});

function displayError(err, paidStatus) {
    const message = `There was an error processing your credit card: ${err.message}`;
    paidStatus.innerHTML = message;

}