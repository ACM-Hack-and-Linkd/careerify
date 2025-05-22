import requests

def interpret_results(QuizResults):
    url = "https://search.linkd.inc/api/search/users"

    querystring = {"limit":"10","acceptance_threshold":"60", "query": "Find users that take these perameters: roles, companies, locations, education_level, experience_level, hobbies. If not applicale, do not take that specific parameter into account." + "Roles: " + QuizResults.roles + ", Companies: " + QuizResults.companies + ", Locations: " + QuizResults.locations + ", Education Level: " + QuizResults.education_level + ", Experience Level: " + QuizResults.experience_level + ", Hobbies: " + QuizResults.hobbies}

    headers = {"Authorization": "Bearer LA_HACKS"}

    response = requests.request("GET", url, headers=headers, params=querystring)

    print(response.text)