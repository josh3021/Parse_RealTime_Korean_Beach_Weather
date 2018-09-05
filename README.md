This is example of obtaining the Real Time Weather of Korean Beach parsed by the official site of Korean Weather Forecast


POST/ 
localhost:3000/parse -> get Real Time Weather Information from 'www.kma.go.kr'

POST/
localhost:3000/gettemp -> get Real Time Temperature Information from 'http://www.nifs.go.kr/risa/main.risa#'

(*QUERY VALUE MUST BE KOREAN TO OBTAIN NORMAL VALUES)
(*WHEN YOU POST /gettemp, YOU MUST PUT WHITESPACE REMOVED KOREAN VALUE AND MUST PUT THE COAST NAME IN COAST LIST AT 'http://www.nifs.go.kr/risa/main.risa#')

----------------HOW TO USE---------------
1. npm install
2. node app.js

------------------EXAMPLE------------------
POST /parser
place=해운대 해수욕장

result example:
{
    "when": "2018년 08월 31일 23:00 발표",
    "where": "강원도 동해시 망상동",
    "whether": "",
    "temp": "20.1℃",
    "hum": "96%",
    "percent": "20",
    "rain": "-",
    "water_temp": "23℃",
    "height_of_waves": "-",
    "sunrise": " 05:53",
    "sunset": " 18:55",
    "rising_tide": [
        " 12:01(20)썰물",
        "-"
    ],
    "ebb_tide": [
        " 05:42(32)밀물",
        " 17:59(33)밀물"
    ]
}

POST /gettemp
place=고성봉포

result example:
{
    "result": "26.5℃"
}