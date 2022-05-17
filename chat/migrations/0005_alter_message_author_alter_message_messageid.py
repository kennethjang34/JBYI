# Generated by Django 4.0.4 on 2022-05-16 00:26

import chat.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0004_alter_message_messageid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages_sent', to='chat.account'),
        ),
        migrations.AlterField(
            model_name='message',
            name='messageID',
            field=models.CharField(default=chat.models.pkgen, max_length=255, primary_key=True, serialize=False),
        ),
    ]
