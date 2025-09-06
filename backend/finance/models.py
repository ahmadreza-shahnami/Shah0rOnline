from django.db import models
from datetime import date, timedelta
from school.models import School, Grade, Membership


class TuitionFee(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    grade = models.ForeignKey(Grade, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    installments_count = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.grade} - {self.amount}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        # حذف اقساط قبلی
        Installment.objects.filter(tuition_fee=self).delete()

        installment_amount = self.amount / self.installments_count

        # همه اعضای دانش‌آموز این پایه
        students = Membership.objects.filter(
            school=self.school,
            classroom__grade=self.grade,
            role__name="student"
        )

        for student in students:
            for i in range(self.installments_count):
                due_date = date.today() + timedelta(days=30 * i)
                Installment.objects.create(
                    student=student,
                    tuition_fee=self,
                    amount=installment_amount,
                    due_date=due_date,
                    status='pending'
                )


class Installment(models.Model):
    student = models.ForeignKey(Membership, on_delete=models.CASCADE, related_name='installments')
    tuition_fee = models.ForeignKey(TuitionFee, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    due_date = models.DateField()
    status_choices = [
        ('pending', 'در انتظار پرداخت'),
        ('paid', 'پرداخت شده'),
        ('late', 'تأخیر در پرداخت'),
    ]
    status = models.CharField(max_length=10, choices=status_choices, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    reminder_sent = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.student.user} - {self.amount} - {self.status}"


class Payment(models.Model):
    student = models.ForeignKey(Membership, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_date = models.DateField()
    status_choices = [
        ('paid', 'پرداخت شده'),
        ('pending', 'در انتظار'),
    ]
    status = models.CharField(max_length=10, choices=status_choices, default='pending')

    def __str__(self):
        return f"{self.student.user} - {self.amount} - {self.status}"


class Salary(models.Model):
    staff = models.ForeignKey(Membership, on_delete=models.CASCADE)
    base_salary = models.DecimalField(max_digits=12, decimal_places=2)
    overtime = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    bonus = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    deduction = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    month = models.IntegerField()
    year = models.IntegerField()
    total_salary = models.DecimalField(max_digits=12, decimal_places=2, editable=False)
    paid = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        self.total_salary = self.base_salary + self.overtime + self.bonus - self.deduction
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.staff.user} - {self.month}/{self.year} ({self.total_salary} تومان)"


class Expense(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    category_choices = [
        ('rent', 'اجاره'),
        ('utilities', 'آب و برق'),
        ('internet', 'اینترنت'),
        ('transport', 'ایاب و ذهاب'),
        ('other', 'سایر'),
    ]
    category = models.CharField(max_length=50, choices=category_choices)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    expense_date = models.DateField()

    def __str__(self):
        return f"{self.school} - {self.title} ({self.amount})"
