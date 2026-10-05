# Registration App (React + Django REST Framework + MySQL)

## 1. Create the MySQL database
```sql
CREATE DATABASE registration_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
(Run it in `mysql -u root -p`.)

## 2. Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```
Set your MySQL password in `project/settings.py` (or via env vars `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST`, `DB_PORT`).

```bash
python manage.py makemigrations registration
python manage.py migrate
python manage.py createsuperuser   # optional, for /admin
python manage.py runserver         # http://127.0.0.1:8000
```

## 3. Frontend
```bash
cd frontend
npm install
npm run dev                        # http://localhost:5173
```

## 4. Test the API
```bash
curl -X POST http://127.0.0.1:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{"name":"K Thulasiram","phone_number":"9876543210","date":"2026-10-05","email":"example@gmail.com"}'
```
Invalid data (returns HTTP 400):
```bash
curl -X POST http://127.0.0.1:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{"name":"R2D2","phone_number":"123","date":"","email":"bad"}'
```

## 5. Verify data in MySQL
```bash
mysql -u root -p registration_db -e "SELECT * FROM registration_registration;"
```
