
from django.shortcuts import render
from django.utils import timezone
from .models import Installment

def send_reminders_view(request):
    today = timezone.now().date()
    installments = Installment.objects.filter(
        due_date__lte=today,
        reminder_sent=False
    )

    results = []
    for installment in installments:
        # فرض کنیم پیام یادآوری فقط در خروجی نمایش داده بشه
        msg = f"یادآوری برای {installment.student} بابت قسط {installment.amount} ارسال شد."
        results.append(msg)

        # علامت‌گذاری به عنوان ارسال‌شده
        installment.reminder_sent = True
        installment.save()

    if not results:
        results.append("هیچ قسطی برای یادآوری وجود ندارد.")

    return render(request, "finance/reminders.html", {"results": results})