from django.contrib import admin
from .models import Wallet, Transaction, ConvertionRate


admin.site.register(Wallet)
admin.site.register(Transaction)
admin.site.register(ConvertionRate)