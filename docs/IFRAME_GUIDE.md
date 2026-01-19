# Cosentus AI - iframe Integration Guide

**Simple copy-paste integration for all Cosentus AI agents**

---

## 🚀 Quick Start

Just copy the iframe code below and paste it into your HTML. That's it!

---

## 💬 Chat Assistant

**AI-powered chat for answering questions about Cosentus**

```html
<iframe 
  src="https://cosentusai.vercel.app/embed/chat" 
  width="100%" 
  height="600" 
  frameborder="0"
  allowfullscreen
></iframe>
```

**Customization Options:**

```html
<!-- Dark theme with custom color -->
<iframe 
  src="https://cosentusai.vercel.app/embed/chat?color=FF5733&theme=dark" 
  width="100%" 
  height="600" 
  frameborder="0"
  allowfullscreen
></iframe>
```

**Available Parameters:**
- `color` - Primary color (hex without #, e.g., `FF5733`)
- `theme` - `light` or `dark`
- `placeholder` - Input placeholder text (URL encoded, e.g., `Ask%20me%20anything`)

---

## 🎤 Voice Agents

**Real-time voice conversations with AI specialists**

### **Chloe - Company Information Expert**
Answers questions about Cosentus services, pricing, and capabilities

```html
<iframe 
  src="https://cosentusai.vercel.app/embed/voice/chloe" 
  width="100%" 
  height="600" 
  frameborder="0"
  allow="microphone"
  allowfullscreen
></iframe>
```

---

### **Cindy - Patient Billing Support**
Helps patients with billing questions and payment assistance

```html
<iframe 
  src="https://cosentusai.vercel.app/embed/voice/cindy" 
  width="100%" 
  height="600" 
  frameborder="0"
  allow="microphone"
  allowfullscreen
></iframe>
```

---

### **Chris - Insurance Claim Follow-Up**
Follows up on insurance claims and resolves denials

```html
<iframe 
  src="https://cosentusai.vercel.app/embed/voice/chris" 
  width="100%" 
  height="600" 
  frameborder="0"
  allow="microphone"
  allowfullscreen
></iframe>
```

---

### **Cassidy - Anesthesia Cost Estimates**
Provides pre-surgery anesthesia cost estimates for patients

```html
<iframe 
  src="https://cosentusai.vercel.app/embed/voice/cassidy" 
  width="100%" 
  height="600" 
  frameborder="0"
  allow="microphone"
  allowfullscreen
></iframe>
```

---

### **Courtney - Appointment Scheduling**
Handles medical appointment scheduling for practices

```html
<iframe 
  src="https://cosentusai.vercel.app/embed/voice/courtney" 
  width="100%" 
  height="600" 
  frameborder="0"
  allow="microphone"
  allowfullscreen
></iframe>
```

---

### **Cara - Eligibility & Benefits Verification**
Verifies patient insurance eligibility and benefits

```html
<iframe 
  src="https://cosentusai.vercel.app/embed/voice/cara" 
  width="100%" 
  height="600" 
  frameborder="0"
  allow="microphone"
  allowfullscreen
></iframe>
```

---

### **Carly - Prior Authorization Follow-Up**
Follows up on prior authorization requests and approvals

```html
<iframe 
  src="https://cosentusai.vercel.app/embed/voice/carly" 
  width="100%" 
  height="600" 
  frameborder="0"
  allow="microphone"
  allowfullscreen
></iframe>
```

---

### **Carson - Payment Reconciliation**
Handles payment reconciliation and discrepancy resolution

```html
<iframe 
  src="https://cosentusai.vercel.app/embed/voice/carson" 
  width="100%" 
  height="600" 
  frameborder="0"
  allow="microphone"
  allowfullscreen
></iframe>
```

---

## 🎨 Customization

All voice agents support these URL parameters:

```html
<iframe 
  src="https://cosentusai.vercel.app/embed/voice/chloe?color=FF5733&theme=dark&buttonText=Start%20Call" 
  width="100%" 
  height="600" 
  frameborder="0"
  allow="microphone"
  allowfullscreen
></iframe>
```

**Available Parameters:**
- `color` - Primary color (hex without #, e.g., `FF5733`)
- `theme` - `light` or `dark`
- `buttonText` - Button text (URL encoded, e.g., `Start%20Call`)

---

## 📐 Sizing Recommendations

### **Full-page embed:**
```html
<iframe src="..." width="100%" height="100vh" frameborder="0" allowfullscreen></iframe>
```

### **Sidebar widget:**
```html
<iframe src="..." width="400px" height="600px" frameborder="0" allowfullscreen></iframe>
```

### **Modal/popup:**
```html
<iframe src="..." width="500px" height="700px" frameborder="0" allowfullscreen></iframe>
```

### **Responsive (maintains aspect ratio):**
```html
<div style="position: relative; padding-bottom: 150%; height: 0; overflow: hidden;">
  <iframe 
    src="..." 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
    frameborder="0" 
    allowfullscreen
  ></iframe>
</div>
```

---

## ⚠️ Important Notes

1. **Microphone Permission Required** - Voice agents need microphone access. Make sure your iframe includes `allow="microphone"`.

2. **HTTPS Required** - The iframe must be embedded on an HTTPS page for microphone access to work.

3. **Browser Compatibility** - Works on all modern browsers (Chrome, Firefox, Safari, Edge).

4. **Mobile Support** - Fully responsive and works on mobile devices.

---

## 🆘 Need Help?

If you have any issues or questions, contact the Cosentus team:
- **Email:** support@cosentus.com
- **Demo Site:** https://cosentusai.vercel.app

---

## 📋 Quick Reference - All iframe URLs

```
Chat Assistant:
https://cosentusai.vercel.app/embed/chat

Voice Agents:
https://cosentusai.vercel.app/embed/voice/chloe
https://cosentusai.vercel.app/embed/voice/cindy
https://cosentusai.vercel.app/embed/voice/chris
https://cosentusai.vercel.app/embed/voice/cassidy
https://cosentusai.vercel.app/embed/voice/courtney
https://cosentusai.vercel.app/embed/voice/cara
https://cosentusai.vercel.app/embed/voice/carly
https://cosentusai.vercel.app/embed/voice/carson
```
