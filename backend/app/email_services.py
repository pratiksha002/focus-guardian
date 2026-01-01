# ==================== EMAIL REPORTS ====================
# File: backend/app/email_service.py

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from typing import Dict, List
import os
from jinja2 import Template

# Email configuration
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "your-email@gmail.com")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "your-app-password")
FROM_EMAIL = os.getenv("FROM_EMAIL", "noreply@focusguardian.com")

# ==================== EMAIL TEMPLATES ====================

DAILY_REPORT_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #06b6d4, #a855f7); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .stat-card { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 15px 0; border-left: 4px solid #06b6d4; }
        .stat-label { color: #64748b; font-size: 14px; margin-bottom: 5px; }
        .stat-value { color: #1e293b; font-size: 28px; font-weight: bold; }
        .progress-bar { background: #e2e8f0; height: 10px; border-radius: 5px; overflow: hidden; margin-top: 10px; }
        .progress-fill { background: linear-gradient(90deg, #10b981, #06b6d4); height: 100%; transition: width 0.3s; }
        .footer { background: #1e293b; color: white; padding: 20px; text-align: center; font-size: 12px; }
        .emoji { font-size: 24px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Daily Focus Report</h1>
            <p>{{ date }}</p>
        </div>
        
        <div class="content">
            <h2>Hello {{ user_name }}! 👋</h2>
            <p>Here's your focus summary for today:</p>
            
            <div class="stat-card">
                <div class="stat-label">Total Sessions</div>
                <div class="stat-value">{{ total_sessions }} <span class="emoji">🎯</span></div>
            </div>
            
            <div class="stat-card">
                <div class="stat-label">Total Focus Time</div>
                <div class="stat-value">{{ total_duration }} <span class="emoji">⏱️</span></div>
            </div>
            
            <div class="stat-card">
                <div class="stat-label">Average Focus Score</div>
                <div class="stat-value">{{ avg_score }}% <span class="emoji">⭐</span></div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: {{ avg_score }}%;"></div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-label">Best Session Score</div>
                <div class="stat-value">{{ best_score }}% <span class="emoji">🏆</span></div>
            </div>
            
            <div class="stat-card">
                <div class="stat-label">Peak Focus Hour</div>
                <div class="stat-value">{{ peak_hour }} <span class="emoji">🔥</span></div>
            </div>
            
            <h3>💡 Insights</h3>
            <ul>
                <li>{{ insight_1 }}</li>
                <li>{{ insight_2 }}</li>
                <li>{{ insight_3 }}</li>
            </ul>
            
            <p style="text-align: center; margin-top: 30px;">
                <a href="https://focusguardian.com/dashboard" style="background: linear-gradient(135deg, #06b6d4, #a855f7); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">View Full Dashboard</a>
            </p>
        </div>
        
        <div class="footer">
            <p>© 2024 Focus Guardian. Keep focusing! 💪</p>
            <p><a href="#" style="color: #06b6d4;">Unsubscribe</a> | <a href="#" style="color: #06b6d4;">Settings</a></p>
        </div>
    </div>
</body>
</html>
"""

WEEKLY_REPORT_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #a855f7, #ec4899); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .week-chart { display: flex; justify-content: space-around; margin: 20px 0; }
        .day-bar { text-align: center; flex: 1; }
        .bar { background: #e2e8f0; width: 30px; height: 100px; margin: 0 auto 10px; border-radius: 5px; position: relative; overflow: hidden; }
        .bar-fill { background: linear-gradient(180deg, #10b981, #06b6d4); width: 100%; position: absolute; bottom: 0; }
        .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
        .stat-box { background: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; }
        .achievement { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📅 Weekly Focus Report</h1>
            <p>{{ week_range }}</p>
        </div>
        
        <div class="content">
            <h2>Great week, {{ user_name }}! 🎉</h2>
            
            <div class="week-chart">
                {% for day in week_data %}
                <div class="day-bar">
                    <div class="bar">
                        <div class="bar-fill" style="height: {{ day.percentage }}%;"></div>
                    </div>
                    <small>{{ day.name }}</small>
                </div>
                {% endfor %}
            </div>
            
            <div class="stat-grid">
                <div class="stat-box">
                    <h3>{{ total_sessions }}</h3>
                    <p>Total Sessions</p>
                </div>
                <div class="stat-box">
                    <h3>{{ total_hours }}h</h3>
                    <p>Total Hours</p>
                </div>
                <div class="stat-box">
                    <h3>{{ avg_score }}%</h3>
                    <p>Avg Score</p>
                </div>
                <div class="stat-box">
                    <h3>{{ streak }} days</h3>
                    <p>Streak</p>
                </div>
            </div>
            
            {% if achievements %}
            <h3>🏆 New Achievements</h3>
            {% for achievement in achievements %}
            <div class="achievement">
                <strong>{{ achievement.title }}</strong><br>
                {{ achievement.description }}
            </div>
            {% endfor %}
            {% endif %}
            
            <h3>📈 This Week's Trends</h3>
            <ul>
                <li>{{ trend_1 }}</li>
                <li>{{ trend_2 }}</li>
                <li>{{ trend_3 }}</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>© 2024 Focus Guardian. Keep up the great work! 🚀</p>
        </div>
    </div>
</body>
</html>
"""

# ==================== EMAIL SERVICE ====================

class EmailService:
    """Service for sending email reports"""
    
    @staticmethod
    def send_email(to_email: str, subject: str, html_content: str):
        """Send an email"""
        try:
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = FROM_EMAIL
            message["To"] = to_email
            
            # Attach HTML content
            html_part = MIMEText(html_content, "html")
            message.attach(html_part)
            
            # Send email
            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USERNAME, SMTP_PASSWORD)
                server.send_message(message)
            
            print(f"Email sent successfully to {to_email}")
            return True
        
        except Exception as e:
            print(f"Error sending email: {e}")
            return False
    
    @staticmethod
    def generate_daily_report(user_data: Dict, stats: Dict) -> str:
        """Generate daily report HTML"""
        template = Template(DAILY_REPORT_TEMPLATE)
        
        # Calculate insights
        insights = []
        if stats['avg_score'] > 75:
            insights.append("Excellent focus today! You're in the zone! 🎯")
        elif stats['avg_score'] > 50:
            insights.append("Good effort today! Keep building that focus muscle! 💪")
        else:
            insights.append("Tomorrow is a new day! Start fresh and focused! 🌅")
        
        if stats['total_sessions'] > 5:
            insights.append("You had multiple focused sessions - great consistency! ⭐")
        
        insights.append(f"Your best hour was {stats['peak_hour']} - try to schedule important tasks then! 🕐")
        
        # Render template
        html = template.render(
            user_name=user_data['name'],
            date=datetime.now().strftime("%B %d, %Y"),
            total_sessions=stats['total_sessions'],
            total_duration=stats['total_duration'],
            avg_score=int(stats['avg_score']),
            best_score=int(stats['best_score']),
            peak_hour=stats['peak_hour'],
            insight_1=insights[0] if len(insights) > 0 else "",
            insight_2=insights[1] if len(insights) > 1 else "",
            insight_3=insights[2] if len(insights) > 2 else ""
        )
        
        return html
    
    @staticmethod
    def generate_weekly_report(user_data: Dict, stats: Dict) -> str:
        """Generate weekly report HTML"""
        template = Template(WEEKLY_REPORT_TEMPLATE)
        
        # Calculate trends
        trends = [
            f"Your average score improved by {stats.get('improvement', 0)}% this week!",
            f"Most productive day was {stats.get('best_day', 'Monday')}",
            f"You maintained a {stats.get('consistency', 0)}% consistency rate"
        ]
        
        html = template.render(
            user_name=user_data['name'],
            week_range=stats['week_range'],
            week_data=stats['week_data'],
            total_sessions=stats['total_sessions'],
            total_hours=stats['total_hours'],
            avg_score=int(stats['avg_score']),
            streak=stats['streak'],
            achievements=stats.get('achievements', []),
            trend_1=trends[0],
            trend_2=trends[1],
            trend_3=trends[2]
        )
        
        return html
    
    @staticmethod
    def send_daily_report(user_email: str, user_name: str, stats: Dict):
        """Send daily report email"""
        user_data = {'name': user_name, 'email': user_email}
        html_content = EmailService.generate_daily_report(user_data, stats)
        
        subject = f"📊 Your Daily Focus Report - {datetime.now().strftime('%B %d, %Y')}"
        return EmailService.send_email(user_email, subject, html_content)
    
    @staticmethod
    def send_weekly_report(user_email: str, user_name: str, stats: Dict):
        """Send weekly report email"""
        user_data = {'name': user_name, 'email': user_email}
        html_content = EmailService.generate_weekly_report(user_data, stats)
        
        subject = f"📅 Your Weekly Focus Report - Week of {stats['week_range']}"
        return EmailService.send_email(user_email, subject, html_content)

# ==================== BACKGROUND TASKS ====================

from fastapi import BackgroundTasks
from app.database import SessionCRUD

async def schedule_daily_report(user_id: int, db):
    """Schedule daily report generation"""
    # Get user stats for today
    stats = SessionCRUD.get_session_stats(db, user_id, days=1)
    
    # Get user info
    from app.database import UserCRUD
    user = UserCRUD.get_user_by_id(db, user_id)
    
    if user and stats['total_sessions'] > 0:
        # Prepare stats for email
        email_stats = {
            'total_sessions': stats['total_sessions'],
            'total_duration': f"{stats['total_duration'] // 3600}h {(stats['total_duration'] % 3600) // 60}m",
            'avg_score': stats['avg_focus_score'],
            'best_score': max([s.avg_focus_score for s in stats['sessions']]) if stats['sessions'] else 0,
            'peak_hour': '2:00 PM'  # Calculate from session data
        }
        
        # Send email
        EmailService.send_daily_report(user.email, user.full_name or user.username, email_stats)

# ==================== API ENDPOINT ====================

from fastapi import APIRouter
router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.post("/send-daily")
async def send_daily_report_now(
    background_tasks: BackgroundTasks,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Manually trigger daily report"""
    background_tasks.add_task(schedule_daily_report, current_user.id, db)
    return {"message": "Daily report will be sent shortly"}