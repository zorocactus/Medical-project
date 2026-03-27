from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from .forms import registerForm , loginForm
from .models import CustomUser

@csrf_exempt
def register(request):
    if request.method == 'POST':
        form = registerForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.save()
            return redirect('login')
    else:
        form = registerForm()

    return render(request, 'users/register.html', {'form': form})
def login(request):
    if request.method == 'POST':
        form = loginForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)

            # redirige selon le rôle
            if user.role == 'doctor':
                return redirect('/doctor-profile/')
            elif user.role == 'patient':
                return redirect('/patient-profile/')
            elif user.role == 'pharmacist':
                return redirect('/pharmacist-profile/')
            elif user.role == 'caretaker':
                return redirect('/caretaker-profile/')
            else:
                return redirect('/')  # home par défaut
    else:
        form = loginForm()
    return render(request, 'users/login.html', {'form': form})