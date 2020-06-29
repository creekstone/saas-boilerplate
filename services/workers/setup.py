import json
from distutils.core import setup, Command
from time import sleep

from dotenv import load_dotenv
from environs import Env
from sqlalchemy import create_engine, exc
from sqlalchemy.engine import url

env = Env()

load_dotenv(dotenv_path='.test.env')

DB_CONNECTION = json.loads(env('DB_CONNECTION'))


def connect(template_engine):
    retries = 0
    while retries <= 20:
        try:
            conn = template_engine.connect()
            return conn
        except exc.OperationalError:
            pass

        sleep(1)
        retries += 1

    return None


def create_test_database():
    template_engine = create_engine(url.URL(**{
        'drivername': DB_CONNECTION['engine'],
        'host': DB_CONNECTION['host'],
        'port': DB_CONNECTION['port'],
        'username': DB_CONNECTION['username'],
        'password': DB_CONNECTION['password'],
        'database': DB_CONNECTION['conndbname']
    }), echo=False)

    conn = connect(template_engine)

    conn = conn.execution_options(autocommit=False)
    conn.execute("ROLLBACK")
    try:
        conn.execute(f"DROP DATABASE {DB_CONNECTION['dbname']}")
    except exc.ProgrammingError as e:
        # Could not drop the database, probably does not exist
        conn.execute("ROLLBACK")
    except exc.OperationalError:
        # Could not drop database because it's being accessed by other users (psql prompt open?)
        conn.execute("ROLLBACK")

    conn.execute(f"CREATE DATABASE {DB_CONNECTION['dbname']}")
    conn.close()

    template_engine.dispose()


class PyTest(Command):
    user_options = []

    def initialize_options(self):
        pass

    def finalize_options(self):
        pass

    def run(self):
        import subprocess
        create_test_database()
        errno = subprocess.call(['pipenv', 'run', 'pytest'])
        raise SystemExit(errno)


setup(cmdclass={'test': PyTest})
