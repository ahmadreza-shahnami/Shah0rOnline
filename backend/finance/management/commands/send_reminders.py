from django.core.management.base import BaseCommand
from datetime import date
from finance.models import Installment

class Command(BaseCommand):
    help = "ارسال یادآوری برای اقساط سررسید شده"

    def handle(self, *args, **kwargs):
        installments = Installment.objects.filter(
            due_date__lte=date.today(),
            reminder_sent=False
        )

        if not installments.exists():
            self.stdout.write(self.style.WARNING("هیچ قسطی برای یادآوری وجود ندارد."))
            return

        for inst in installments:
            self.stdout.write(
                self.style.SUCCESS(f"ارسال یادآوری به {inst.student.full_name} مبلغ {inst.amount}")
            )
            inst.reminder_sent = True
            inst.save()

        self.stdout.write(self.style.SUCCESS("یادآوری اقساط با موفقیت ارسال شد ✅"))