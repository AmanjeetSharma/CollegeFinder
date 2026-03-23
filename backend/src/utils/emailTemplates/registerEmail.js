// emailTemplates.js
const registerEmail = (url) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email - Career Advisor</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
                    background-color: #f4f4f5;
                    line-height: 1.6;
                }
                
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                
                .email-wrapper {
                    background-color: #ffffff;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                }
                
                .header {
                    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                    padding: 40px 30px;
                    text-align: center;
                }
                
                .logo {
                    font-size: 28px;
                    font-weight: bold;
                    color: #ffffff;
                    margin-bottom: 10px;
                }
                
                .logo span {
                    font-weight: normal;
                    color: #ffd966;
                }
                
                .tagline {
                    color: rgba(255,255,255,0.9);
                    font-size: 14px;
                    margin-top: 8px;
                }
                
                .content {
                    padding: 40px 30px;
                }
                
                .greeting {
                    font-size: 24px;
                    color: #1f2937;
                    margin-bottom: 20px;
                    font-weight: 600;
                }
                
                .message {
                    color: #4b5563;
                    margin-bottom: 20px;
                    font-size: 16px;
                }
                
                .button-container {
                    text-align: center;
                    margin: 35px 0;
                }
                
                .verify-button {
                    display: inline-block;
                    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                    color: #ffffff !important;
                    text-decoration: none;
                    padding: 14px 32px;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 16px;
                    transition: transform 0.2s, box-shadow 0.2s;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                
                .verify-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(30, 60, 114, 0.4);
                }
                
                .alt-link {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 14px;
                    color: #6b7280;
                }
                
                .alt-link a {
                    color: #1e3c72;
                    text-decoration: none;
                    word-break: break-all;
                }
                
                .alt-link a:hover {
                    text-decoration: underline;
                }
                
                .features-grid {
                    background-color: #f9fafb;
                    padding: 20px;
                    margin: 25px 0;
                    border-radius: 12px;
                }
                
                .feature-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 12px;
                    color: #4b5563;
                    font-size: 14px;
                }
                
                .feature-icon {
                    font-size: 18px;
                    margin-right: 12px;
                    min-width: 24px;
                }
                
                .info-box {
                    background-color: #e8f0fe;
                    border-left: 4px solid #1e3c72;
                    padding: 15px 20px;
                    margin: 25px 0;
                    border-radius: 8px;
                }
                
                .info-text {
                    color: #1e3c72;
                    font-size: 14px;
                    margin: 0;
                    font-weight: 500;
                }
                
                .footer {
                    background-color: #f9fafb;
                    padding: 25px 30px;
                    text-align: center;
                    border-top: 1px solid #e5e7eb;
                }
                
                .footer-text {
                    color: #6b7280;
                    font-size: 12px;
                    margin: 5px 0;
                }
                
                .social-links {
                    margin: 15px 0;
                }
                
                .social-links a {
                    color: #9ca3af;
                    text-decoration: none;
                    margin: 0 10px;
                    font-size: 12px;
                }
                
                .highlight {
                    color: #1e3c72;
                    font-weight: 600;
                }
                
                @media only screen and (max-width: 480px) {
                    .content {
                        padding: 30px 20px;
                    }
                    
                    .header {
                        padding: 30px 20px;
                    }
                    
                    .verify-button {
                        padding: 12px 24px;
                        font-size: 14px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="email-wrapper">
                    <div class="header">
                        <div class="logo">
                            Career<span>Guide</span>
                        </div>
                        <div class="tagline">
                            Your Personalized Path to Success
                        </div>
                    </div>
                    
                    <div class="content">
                        <div class="greeting">
                            Welcome to CollegeFinder! 🎓
                        </div>
                        
                        <div class="message">
                            Thank you for joining India's premier career guidance platform for Class 10th & 12th students. 
                            We're excited to help you discover your perfect career path!
                        </div>
                        
                        <div class="button-container">
                            <a href="${url}" class="verify-button">
                                Verify Your Email
                            </a>
                        </div>
                        
                        <div class="alt-link">
                            Or copy and paste this link into your browser:<br>
                            <a href="${url}">${url}</a>
                        </div>
                        
                        <div class="features-grid">
                            <div class="feature-item">
                                <span class="feature-icon">🧠</span>
                                <span><strong>Aptitude-Based Tests</strong> - Discover your strengths and interests</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">🤖</span>
                                <span><strong>AI-Powered Recommendations</strong> - Personalized subject streams & career paths</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">🏛️</span>
                                <span><strong>College & Scholarship Info</strong> - Government colleges, entrance exams, scholarships</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">📱</span>
                                <span><strong>SMS Verified Access</strong> - Secure & authenticated user experience</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">📊</span>
                                <span><strong>Progress Tracking</strong> - Stay on top with reminders & updates</span>
                            </div>
                        </div>
                        
                        <div class="info-box">
                            <p class="info-text">
                                ⭐ <strong>What awaits you after verification:</strong><br>
                                • Personalized career recommendations based on your abilities<br>
                                • Access to entrance exam eligibility tools<br>
                                • Real-time updates on admissions & results<br>
                                • Smart progress tracking with timely reminders
                            </p>
                        </div>
                        
                        <div class="message" style="font-size: 14px; margin-top: 25px; background-color: #fff3e0; padding: 12px; border-radius: 8px;">
                            🔒 <strong>Security Notice:</strong> This verification link will expire in 24 hours. 
                            If you didn't register for CollegeFinder, please ignore this email.
                        </div>
                    </div>
                    
                    <div class="footer">
                        <div class="social-links">
                            <a href="#">Help Center</a> •
                            <a href="#">Privacy Policy</a> •
                            <a href="#">Terms of Service</a> •
                            <a href="#">Contact Us</a>
                        </div>
                        <p class="footer-text">
                            © 2024 CollegeFinder. All rights reserved.<br>
                            Empowering students to make informed career decisions
                        </p>
                        <p class="footer-text" style="font-size: 11px;">
                            This is an automated message from CollegeFinder - Your trusted career advisor.<br>
                            Please do not reply to this email.
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
};

export default registerEmail;