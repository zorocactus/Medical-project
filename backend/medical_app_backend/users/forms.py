from django import forms
from .models import CustomUser

class registerForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    class Meta:
        model = CustomUser
        fields = ['user_id' ,'first_name', 'last_name', 'email', 'password', 'role']
class loginForm(forms.Form):
    email = forms.EmailField( required=False)
    password = forms.CharField(widget=forms.PasswordInput)