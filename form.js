// Supabase configuration - Replace with your actual values
const SUPABASE_URL = 'https://tspomzaelcemkxkpnjrr.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_Jb3oovwvfV2flL2GfOQd3w_BRoC89C4';

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Handle form submission
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    // Get form data
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email') || null;
    const phone = formData.get('phone') || null;
    const message = formData.get('message') || null;

    // Validate: at least one of email or phone must be provided
    if (!email && !phone) {
      alert('Please provide either an email or phone number.');
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
      return;
    }

    try {
      // Insert into Supabase table
      const { data, error } = await supabaseClient
        .from('website_contact_submissions')
        .insert([
          {
            name: name,
            email: email,
            phone_number: phone,
            message: message
          }
        ]);

      if (error) throw error;

      // Success - reset form and show message
      form.reset();
      submitButton.textContent = 'Message sent!';
      submitButton.style.background = '#4caf50';
      
      setTimeout(() => {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        submitButton.style.background = '';
      }, 3000);

    } catch (error) {
      console.error('Error submitting form:', error);
      submitButton.textContent = 'Error - try again';
      submitButton.style.background = '#f1381a';
      
      setTimeout(() => {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        submitButton.style.background = '';
      }, 3000);
    }
  });
});

