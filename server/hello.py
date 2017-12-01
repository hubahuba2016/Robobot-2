from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import botometer
import tweepy
import urllib
import urllib.request as ur
import re
import json

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

bot_score = 0.4
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# TWEET()
def get_user_ids_of_post_likes(post_id):
    try:
        json_data = ur.urlopen('https://twitter.com/i/activity/favorited_popup?id=' + str(post_id)).read()
        found_ids = re.findall(r'data-user-id=\\\\\\"+\d+', json.dumps(json_data.decode('utf-8')))
        unique_ids = list(set([re.findall(r'\d+', match)[0] for match in found_ids]))
        return unique_ids
    except urllib.error.HTTPError:
        return False

#change bot_score
def set_score_helper(num):
    slide_score = int(float(num))
    global bot_score
    bot_score = slide_score/100
    return str(bot_score)


def check_post_helper(id, act):
    postObj = api.get_status(id)
    users = []
    found = ''
    if act == 'Likes':
        found = get_user_ids_of_post_likes(id)
        # Limit because slow
        index = 0;
        for ids in found:
            if (index < 5):
                users.append('@' + api.get_user(ids).screen_name)
            index = index + 1;
    if act == 'Retweets':
        found = api.retweets(postObj.id)
        # Limit because slow
        index = 0;
        for name in found:
            if (index < 5):
                users.append('@' + name.user.screen_name)
            index = index + 1;
    results = list(bom.check_accounts_in(users))
    return results
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# FOLLOW()
def get_friends(user_id):
    users = []
    page_count = 0
    for user in tweepy.Cursor(api.friends, id=user_id, count=200).pages():
        page_count += 1
        users.extend(user)
    return users
def follow_helper(userIn, act):
    user = api.get_user(screen_name = userIn)
    accounts = []
    if act == 'Following':
        index = 0;
        for following in get_friends(user.id_str):
            # Limit accounts to check because slow
            if (index < 5) :
                accounts.append('@' + following.screen_name)
            index = index + 1;
        results = list(bom.check_accounts_in(accounts))
    elif act == 'Followers':
        index = 0;
        for followers in user.followers():
            if (index < 5):
                accounts.append('@' + followers.screen_name)
            index = index + 1;
        results = list(bom.check_accounts_in(accounts))
    count = 0
    # TODO FIX THIS
    for score in results:
        if ('scores' in score[1]) :
            print('FOLLOW()', score[0], score[1]['scores']['english'])
            if score[1]['scores']['english'] > bot_score:
                count = count + 1
    return str(count)

######

def is_user_bot_helper(screen_name):
    # post = api.get_status(id)
    # user = '@' + post.user.screen_name
    user = '@' + screen_name
    result = bom.check_account(user)
    score = result['scores']['english']
    thing = '?'

    if (score > bot_score):
        thing = 'bot'
    else:
        thing = 'not'

    print(screen_name, score, thing)

    return jsonify(score=score,
                   thing=thing)

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

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# Flask app
app = Flask(__name__)
CORS(app, support_credentials=True)

#get new score and set bot_score to it
@app.route("/set_score", methods=['GET', 'POST'])
@cross_origin(support_credentials=True)
def set_score():
    return set_score_helper(request.get_json())

# TWEET()
@app.route("/check_post/<string>", methods=['GET', 'POST'])
@cross_origin(support_credentials=True)
def check_post(string):
    if string == 'Likes':
        print('getting LIKES')
        bots = check_post_helper(request.get_json(), 'Likes')
    elif string == 'Retweets':
        print('getting RETWEETS')
        bots = check_post_helper(request.get_json(), 'Retweets')
    count = 0
    for bot in bots:
        if ('scores' in bot[1]):
            print('TWEET()', bot[0], bot[1]['scores']['english'])
            if bot[1]['scores']['english'] > bot_score:
                count = count + 1
    return str(count)
# FOLLOW()
@app.route("/follow/<string>", methods=['GET', 'POST'])
@cross_origin(support_credentials=True)
def follow(string):
    if string == 'Followers':
        print('getting FOLLOWERS')
        return follow_helper(request.get_json(), 'Followers')
    elif string == 'Following':
        print('getting FOLLOWING')
        return follow_helper(request.get_json(), 'Following')

#####

def check_post():
    bots = check_post_helper(request.get_json())
    # scores = []
    count = 0

    for bot in bots:
        # scores.append(bot[1]['scores']['english'])
        if bot[1]['scores']['english'] > bot_score:
            count = count + 1

    return str(count)

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
    app.run(processes=3)