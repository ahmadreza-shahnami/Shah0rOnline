from django.contrib import admin
from django.urls import path
from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from django.http import HttpResponse
from django.template.loader import render_to_string
from xhtml2pdf import pisa
from django.conf import settings
import datetime
import csv
import os

from .models import (
    School, Grade, Student, TuitionFee, Payment, 
    Staff, Salary, Expense, Installment
)
from .reports import monthly_financial_report

# ---------------------------
# ویوها
# ---------------------------

@staff_member_required
def monthly_report_view(request):
    schools = School.objects.all()
    report = None

    school_id = request.GET.get("school_id")
    month = request.GET.get("month")
    year = request.GET.get("year")

    if school_id and month and year:
        report = monthly_financial_report(
            school_id=int(school_id),
            month=int(month),
            year=int(year),
        )

    context = {
        "schools": schools,
        "report": report,
        "selected_school": int(school_id) if school_id else None,
        "month": month or datetime.date.today().month,
        "year": year or datetime.date.today().year,
    }
    return render(request, "admin/finance/monthly_report.html", context)


def monthly_report_pdf(request):
    school_id = request.GET.get("school_id")
    month = request.GET.get("month")
    year = request.GET.get("year")

    if not (school_id and month and year):
        return HttpResponse("پارامترهای school_id، month و year الزامی هستند")

    school = School.objects.get(id=school_id)
    report = monthly_financial_report(int(school_id), int(month), int(year))

    # مسیر فونت واقعی
    font_path = os.path.join(settings.BASE_DIR, 'finance', 'fonts', 'DejaVuSans.ttf')

    html = render_to_string("admin/finance/monthly_report_pdf.html", {
        "school": school,
        "month": month,
        "year": year,
        "report": report,
        "font_path": font_path,
    })

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'inline; filename="report_{school.name}_{month}_{year}.pdf"'

    pisa_status = pisa.CreatePDF(html, dest=response)
    if pisa_status.err:
        return HttpResponse("خطا در تولید PDF")
    return response


@staff_member_required
def download_monthly_report_csv(request):
    school_id = request.GET.get("school_id")
    month = request.GET.get("month")
    year = request.GET.get("year")

    if not (school_id and month and year):
        return HttpResponse("پارامترهای school_id، month و year لازم هستند.")

    report = monthly_financial_report(
        school_id=int(school_id),
        month=int(month),
        year=int(year)
    )

    # ایجاد پاسخ CSV با UTF-8 و BOM برای فارسی
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="monthly_report_{school_id}_{month}_{year}.csv"'
    response.write(u'\ufeff'.encode('utf8'))

    writer = csv.writer(response)
    writer.writerow(['عنوان', 'مقدار'])
    writer.writerow(['درآمد', report['income']])
    writer.writerow(['حقوق پرسنل', report['salary_total']])
    writer.writerow(['هزینه‌های ثابت', report['expenses_total']])
    writer.writerow(['کل هزینه‌ها', report['total_expenses']])
    writer.writerow(['سود/زیان', report['profit']])

    return response


# ---------------------------
# ثبت مدل‌ها
# ---------------------------

admin.site.register(School)
admin.site.register(Grade)
admin.site.register(Student)
admin.site.register(TuitionFee)
admin.site.register(Payment)
admin.site.register(Staff)
#admin.site.register(Salary)
admin.site.register(Expense)


# ---------------------------
# اضافه کردن URL سفارشی
# ---------------------------

original_get_urls = admin.site.get_urls

def get_urls():
    urls = original_get_urls()
    custom_urls = [
        path("finance/monthly-report/", monthly_report_view, name="monthly-report"),
        path("finance/monthly-report/pdf/", monthly_report_pdf, name="monthly-report-pdf"),
        path("finance/monthly-report/download-csv/", download_monthly_report_csv, name="download-monthly-report-csv"),
    ]
    return custom_urls + urls

admin.site.get_urls = get_urls


# ---------------------------
# Admin سفارشی برای Installment
# ---------------------------

@admin.register(Installment)
class InstallmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'tuition_fee', 'amount', 'due_date', 'status')
    list_filter = ('status', 'due_date')
    search_fields = ('student__name', 'tuition_fee__grade__name')
    actions = ['mark_as_paid', 'mark_as_late']

    def mark_as_paid(self, request, queryset):
        updated = queryset.update(status='paid')
        self.message_user(request, f"{updated} قسط به پرداخت شده تغییر یافت")
    mark_as_paid.short_description = "علامت گذاری به عنوان پرداخت شده"

    def mark_as_late(self, request, queryset):
        updated = queryset.update(status='late')
        self.message_user(request, f"{updated} قسط به تأخیر تغییر یافت")
    mark_as_late.short_description = "علامت گذاری به عنوان تأخیر"





@admin.register(Salary)
class SalaryAdmin(admin.ModelAdmin):
    list_display = ('staff', 'month', 'year', 'base_salary', 'overtime', 'bonus', 'deduction', 'total_salary')
    list_filter = ('year', 'month')
    search_fields = ('staff__name',)

