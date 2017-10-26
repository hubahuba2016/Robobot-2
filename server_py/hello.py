from flask import Flask, request
from flask_cors import CORS, cross_origin
import botometer
import tweepy

# Secret keys
mashape_key = "uKUDX0gpUqmshZ4XfpfE2Kzh9kgSp1nqeCKjsnynmzOcFDF6lw"
twitter_app_auth = {
    'consumer_key': '8btgkkENoxJGVPFhuhzWg3QDz',
    'consumer_secret': 'ay88Z9Wqf7QFL6vDm1CLa7LpAt55EipE3ndoFlzslHuN25pfKW',
    'access_token': '1517890854-M3KSvLUrlT4pYKc5ftehmTuCS9ukRexYnIbg9rT',
    'access_token_secret': 'cYMY5Pehr2mKXdpmPn3K7J3xUI4Ifnfsssctdch8nsQv2',
}

# Authentication
auth = tweepy.OAuthHandler(twitter_app_auth['consumer_key'], twitter_app_auth['consumer_secret'])
auth.set_access_token(twitter_app_auth['access_token'], twitter_app_auth['access_token_secret'])

# APIs
bom = botometer.Botometer(mashape_key=mashape_key, **twitter_app_auth)
api = tweepy.API(auth)

# Helper functions
def check_post_helper(id):
    # load post obj by id
    postObj = api.get_status(id)
    
    
    # load retweeters
    users = []
    retweeters = api.retweets(postObj.id)
    for rtrs in retweeters:
        users.append('@' + rtrs.user.screen_name)
        
    # run retweeters through botometer
    results = list(bom.check_accounts_in(users))
    return results[:5]

def is_user_bot_helper(screen_name):
    # post = api.get_status(id)
    # user = '@' + post.user.screen_name
    print(screen_name)
    print('\n\n\n\n\n\n\n')
    user = '@' + screen_name
    result = bom.check_account(user)
    
    if (result['scores']['english'] > 0.4):
        return 'bot'
    else:
        return 'not'

def average_score_helper(user):
    # Create list of followers
    accounts = []
    for follower in user.followers():
        accounts.append('@' + follower.screen_name)
    results = list(bom.check_accounts_in(accounts))
    
    # Calculate average score
    index = 0 
    score = 0
    for index in range(len(results)):
        score = score + results[index][1]['scores']['english']
    return "The average follower bot score is: " + str(score / len(results))

# Flask app
app = Flask(__name__)
CORS(app, support_credentials=True)

# App routing
@app.route("/check_post", methods=['GET', 'POST'])
@cross_origin(support_credentials=True)
def check_post():
    bots = check_post_helper(request.get_json())
    scores = []

    for bot in bots:
        scores.append(bot[1]['scores']['english'])

    return scores

@app.route("/is_user_bot", methods=['GET', 'POST'])
@cross_origin(support_credentials=True)
def is_user_bot():
    return is_user_bot_helper(request.get_json())

@app.route("/average_score", methods=['GET', 'POST'])
@cross_origin(support_credentials=True)
def average_score():
    user = api.get_user(request.get_json())
    return average_score_helper(request.get_json())

if __name__ == "__main__":
    app.run()