# Generated by Django 4.0.4 on 2022-05-14 07:12

import chat.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Account',
            fields=[
                ('userID', models.CharField(default=chat.models.pkgen, max_length=15, primary_key=True, serialize=False)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('friends', models.ManyToManyField(related_name='accounts', to='chat.account')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='accounts', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('messageID', models.CharField(default=chat.models.pkgen, max_length=255, primary_key=True, serialize=False)),
                ('content', models.TextField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Chat',
            fields=[
                ('chatID', models.CharField(default=chat.models.pkgen, max_length=20, primary_key=True, serialize=False)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('messages', models.ManyToManyField(related_name='chats', to='chat.message')),
                ('participants', models.ManyToManyField(related_name='chats', to='chat.account')),
            ],
        ),
    ]
