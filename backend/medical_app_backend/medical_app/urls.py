from django.contrib import admin
from django.urls import path
from django.shortcuts import redirect
from users import views as user_views  # si ton app s'appelle 'users'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', user_views.register, name='register'),
    path('login/', user_views.login, name='login'),
    path('', lambda request: redirect('login')),  # redirige la racine vers /register/
]