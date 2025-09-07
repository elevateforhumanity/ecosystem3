/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

// Shared enrollment functionality for all sister sites
const PAY_API = "https://pay.elevateforhumanity.org/api/checkout";

// Main enrollment function - reuse existing Pay backend
export async function efhEnroll({ programName, priceId="", amountUSD=0, metadata={} }) {
  const body = priceId
    ? { priceId, quantity: 1, metadata }
    : { productName: programName, unitAmount: Math.round(amountUSD * 100), currency: "usd", quantity: 1, metadata };
  
  try {
    const res = await fetch(PAY_API, { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      credentials: "include", 
      body: JSON.stringify(body) 
    });
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    const data = await res.json();
    if (data?.url) {
      location.href = data.url;
    } else {
      console.error('Checkout failed:', data);
      alert(data?.error || "Checkout failed. Please try again.");
    }
  } catch (error) {
    console.error('Enrollment error:', error);
    alert("Unable to process enrollment. Please check your connection and try again.");
  }
}

// Show enrollments on any site
export async function showEnrollments(containerId = 'my-enrollments') {
  const me = await window.efhLoadMe();
  if (!me?.user_id) return;

  const { supabase } = await import('./supabase.js');
  const { data } = await supabase
    .from('enrollments')
    .select('program_slug,status,started_at,completed_at')
    .order('created_at', { ascending: false });

  // Render enrollment list
  const el = document.getElementById(containerId);
  if (!el) return;
  
  if (!data || !data.length) {
    el.textContent = '';
    const li = document.createElement('li');
    li.className = 'muted';
    li.textContent = 'No enrollments yet.';
    el.appendChild(li);
    return;
  }
  
  // Clear existing content safely
  el.textContent = '';
  
  data.forEach(e => {
    const started = e.started_at ? new Date(e.started_at).toLocaleDateString() : '—';
    const statusBadge = e.status === 'active' ? '🟢' : e.status === 'completed' ? '✅' : '⏳';
    
    // Create list item safely using DOM methods
    const li = document.createElement('li');
    
    // Add status badge (safe text)
    li.textContent = statusBadge + ' ';
    
    // Add program name in bold (safe, escapes HTML)
    const strong = document.createElement('strong');
    strong.textContent = e.program_slug;
    li.appendChild(strong);
    
    // Add status and date (safe text)
    li.appendChild(document.createTextNode(' — ' + e.status + ' '));
    
    const span = document.createElement('span');
    span.className = 'hint';
    span.textContent = 'started ' + started;
    li.appendChild(span);
    
    el.appendChild(li);
  });
}

// Make functions globally available
window.efhEnroll = efhEnroll;
window.efhShowEnrollments = showEnrollments;