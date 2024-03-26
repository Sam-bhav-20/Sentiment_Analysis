import os

# from flask_migrate import Migrate
# from flask_cli import FlaskCLI

# from app import create_app, db
from app import app
# app = create_app(os.getenv('BOILERPLATE_ENV') or 'dev')

# app.app_context().push()

# migrate = Migrate(app, db)

# FlaskCLI(app)

# @app.cli.command()
# def run():
#     app.run(port = os.getenv('PORT'))


if __name__ == '__main__': app.run(debug = True)