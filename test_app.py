from unittest import TestCase
from app import app
from flask import session

class FlaskTests(TestCase):
    def setUp(self):
        self.client = app.test_client()
        app.config['TESTING'] = True 

    def tearDown(self):
        pass 

    def test_session_data(self):
        with app.test_client() as client:
            with client.session_transaction() as sess:
                sess['username'] = 'test_user'
            
            with client as c:
                response = c.get('/play')
                self.assertEqual(response.status_code, 200)
                with c.session_transaction() as sess:
                    self.assertIn('username', sess)
                    self.assertEqual(sess['username'], 'test_user')


