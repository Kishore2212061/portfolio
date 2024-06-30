document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = {
            fullName: form.fullName.value,
            email: form.email.value,
            phoneNumber: form.phoneNumber.value,
            emailSubject: form.emailSubject.value,
            message: form.message.value
        };

        try {
            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Message sent successfully');
            } else {
                alert('Failed to send message');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });
});
