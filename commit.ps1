# Skrypt PowerShell do automatycznego commitu i wypchnięcia zmian do GitHub
# Zakładamy, że znajdujemy się w katalogu repozytorium GIT

# Przejście do katalogu repozytorium
cd "C:\Users\Nagrywanie\OneDrive - Sławomir Mentzen\Pulpit\FORM-PRIME"

# Dodanie wszystkich zmian
git add .

# Commit z opisem "automatyczny commit"
git commit -m "automatyczny commit"

# Wypchnięcie zmian do zdalnego repozytorium
git push origin main

# Informacja, że skrypt zakończył działanie
Write-Host "Skrypt zakonczony"
