from django.db import models
from account.models import CustomUser

class Wallet(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='wallet')
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name="Balance")
    last_updated = models.DateTimeField(auto_now=True, verbose_name="Last Updated")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created")
    is_active = models.BooleanField(default=True, verbose_name="Is Active")

    def __str__(self):
        return f"Wallet of {self.user} - Balance: {self.balance}"
    


class Transaction(models.Model):

    TRANSACTION_TYPE_CHOICES = (
        ('deposit', 'Deposit'),
        ('withdrawal', 'Withdrawal'),
    )

    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPE_CHOICES)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_type} of {self.amount} to {self.wallet.user.username}"


class ConvertionRate(models.Model):
    currency = models.CharField("Currency", max_length=50)
    value = models.IntegerField("Rate")
    last_updated = models.DateTimeField(auto_now=True, verbose_name="Last Updated")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created")

    def __str__(self):
        return f"1 $PAM = {self.value} {self.currency}"




