from django.db import models
from datetime import date, timedelta

# ----------------------
# مدرسه
# ----------------------
class School(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

# ----------------------
# پایه تحصیلی
# ----------------------
class Grade(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)  # مثل اول دبستان، دوم دبیرستان
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.school.name}"

# ----------------------
# دانش‌آموز
# ----------------------
class Student(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    grade = models.ForeignKey(Grade, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255)

    def __str__(self):
        return self.full_name

# ----------------------
# شهریه
# ----------------------
class TuitionFee(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    grade = models.ForeignKey(Grade, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    installments_count = models.PositiveIntegerField(default=1)  # تعداد اقساط
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.grade} - {self.amount}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  # ابتدا شهریه ذخیره می‌شود

        # Import در داخل متد برای جلوگیری از circular import
        from django.apps import apps
        Installment = apps.get_model('finance', 'Installment')

        # حذف اقساط قدیمی این شهریه
        Installment.objects.filter(tuition_fee=self).delete()

        # تقسیم شهریه به اقساط
        installment_amount = self.amount / self.installments_count
        students = Student.objects.filter(grade=self.grade, school=self.school)

        for student in students:
            for i in range(self.installments_count):
                due_date = date.today() + timedelta(days=30*i)  # هر قسط ماهانه
                Installment.objects.create(
                    student=student,
                    tuition_fee=self,
                    amount=installment_amount,
                    due_date=due_date,
                    status='pending'
                )

# ----------------------
# پرداخت‌ها
# ----------------------
class Payment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_date = models.DateField()
    status_choices = [
        ('paid', 'پرداخت شده'),
        ('pending', 'در انتظار'),
    ]
    status = models.CharField(max_length=10, choices=status_choices, default='pending')







class Installment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='installments')
    tuition_fee = models.ForeignKey(TuitionFee, on_delete=models.CASCADE)
    amount = models.PositiveIntegerField()  # مبلغ قسط
    due_date = models.DateField()           # تاریخ سررسید
    status_choices = [
        ('pending', 'در انتظار پرداخت'),
        ('paid', 'پرداخت شده'),
        ('late', 'تأخیر در پرداخت'),
    ]
    status = models.CharField(max_length=10, choices=status_choices, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    reminder_sent = models.BooleanField(default=False)  # اضافه شد


    def __str__(self):
        return f"{self.student} - {self.amount} - {self.status}"








# ----------------------
# پرسنل و حقوق
# ----------------------
from django.db import models


class Staff(models.Model):
    school = models.ForeignKey("School", on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255)
    position = models.CharField(max_length=100)  # معلم، مدیر، کارمند

    def __str__(self):
        return f"{self.full_name} ({self.position})"


class Salary(models.Model):
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE)
    base_salary = models.DecimalField(max_digits=12, decimal_places=2)  # حقوق پایه
    overtime = models.DecimalField(max_digits=12, decimal_places=2, default=0)  # اضافه‌کار
    bonus = models.DecimalField(max_digits=12, decimal_places=2, default=0)  # پاداش
    deduction = models.DecimalField(max_digits=12, decimal_places=2, default=0)  # کسری/جریمه
    month = models.IntegerField()
    year = models.IntegerField()
    total_salary = models.DecimalField(max_digits=12, decimal_places=2, editable=False)  # محاسبه خودکار
    paid = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # محاسبه حقوق نهایی قبل از ذخیره
        self.total_salary = self.base_salary + self.overtime + self.bonus - self.deduction
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.staff.full_name} - {self.month}/{self.year} ({self.total_salary} تومان)"


# ----------------------
# هزینه‌های ثابت
# ----------------------
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
