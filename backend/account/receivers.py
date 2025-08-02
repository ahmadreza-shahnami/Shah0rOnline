from django.dispatch import receiver
from django.db.models import signals as modelSignals
from wallet.models import Wallet
from .models import CustomUser

@receiver(modelSignals.post_save, sender=CustomUser)
def create_user_wallet(sender, instance, created, **kwargs):
    if created:
        try:
            wallet = Wallet.objects.create(user=instance, balance=0)
            print(f"created {wallet}")
        except Exception as e:
            print("an error occured while creating wallet:", e)
