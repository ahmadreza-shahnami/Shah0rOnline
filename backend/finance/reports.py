from .models import Payment, Salary, Expense
from django.db.models import Sum


def monthly_financial_report(school_id, month, year):
    # ------------------------------
    # محاسبه مجموع‌ها
    # ------------------------------
    income = Payment.objects.filter(
        student__school_id=school_id,
        payment_date__year=year,
        payment_date__month=month,
        status='paid'
    ).aggregate(total=Sum('amount'))['total'] or 0

    salary_qs = Salary.objects.filter(
        staff__school_id=school_id,
        month=month,
        year=year
    )
    salary_total = salary_qs.aggregate(total=Sum('total_salary'))['total'] or 0

    expenses_qs = Expense.objects.filter(
        school_id=school_id,
        expense_date__year=year,
        expense_date__month=month
    )
    expenses_total = expenses_qs.aggregate(total=Sum('amount'))['total'] or 0

    total_expenses = salary_total + expenses_total
    profit = income - total_expenses

    # ------------------------------
    # خروجی گزارش
    # ------------------------------
    report = {
        'income': income,
        'salary_total': salary_total,
        'expenses_total': expenses_total,
        'total_expenses': total_expenses,
        'profit': profit,

        # جزئیات
        'payments': Payment.objects.filter(
            student__school_id=school_id,
            payment_date__year=year,
            payment_date__month=month,
            status='paid'
        ).select_related("student"),

        'salaries': salary_qs.select_related("staff"),

        'expenses': expenses_qs,
    }
    return report
