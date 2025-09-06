from datetime import date, timedelta
from .models import Installment

def get_due_installments(days_before=3):
    """اقساطی که تا X روز آینده سررسید دارند و یادآوری برایشان ارسال نشده"""
    today = date.today()
    upcoming_date = today + timedelta(days=days_before)
    return Installment.objects.filter(
        due_date__range=(today, upcoming_date),
        status='pending',
        reminder_sent=False
    )
