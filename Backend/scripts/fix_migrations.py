import sqlite3
import shutil
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / 'db.sqlite3'
BACKUP_PATH = BASE_DIR / 'db.sqlite3.migrations-bak'

print('DB path:', DB_PATH)
if not DB_PATH.exists():
    raise SystemExit('db.sqlite3 not found')

shutil.copy2(DB_PATH, BACKUP_PATH)
print('Backup created at', BACKUP_PATH)

conn = sqlite3.connect(DB_PATH)
c = conn.cursor()
# Delete admin migration records so migrations can be applied in proper order
c.execute("DELETE FROM django_migrations WHERE app='admin'")
conn.commit()
print('Deleted admin rows from django_migrations')
conn.close()
