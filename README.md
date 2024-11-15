# Getting Started with Roxiler App

First instal all nodeJs dependencies using `npm install` from frontend and ROXILER_API folder

## Here are the some endpoints

### 1. `http://localhost:5000/init`

this is for initialized database, Here I use MongoDb and database is local MongoDb `mongodb://localhost:27017/RoxilerDB`

### 2. `http://localhost:5000/find`

You can pass following parameters to this url using query string and if you not pass then it takes default valuesas mentioned
1.month ="March", 2.search = "", 3.page = 1, 4.perPage = 10

### 3`http://localhost:5000/pie_chart`

This endpoints gives pieChart Data

````
{
   {
    "electronics": 2,
    "women's clothing": 2,
    "men's clothing": 2
}
```

### 4`http://localhost:5000/bar_chart`

This endpoints gives barChart Data

````

{
"0-100": 1,
"101-200": 1,
"201-300": 1,
"301-400": 0,
"401-500": 0,
"501-600": 2,
"601-700": 0,
"701-800": 0,
"801-900": 0,
"901-above": 1
}

```

### 5`http://localhost:5000/statistics`

This endpoints gives statistics Data

```

{
"TotalSale": 5284.9,
"TotalItems": 2,
"notSale": 4
}```

### 5`http://localhost:5000/combined`

This endpoints gives All umportant Data of App

````{
    "products": [],
    "totalProducts": 0,
    "statistics": {
        "TotalSale": 0,
        "TotalItems": 0,
        "notSale": 0
    },
    "barChart": {
        "0-100": 0,
        "101-200": 0,
        "201-300": 0,
        "301-400": 0,
        "401-500": 0,
        "501-600": 0,
        "601-700": 0,
        "701-800": 0,
        "801-900": 0,
        "901-above": 0
    },
    "pieChart": {}
}```
````

### Frontend

The Frontend app is in react and the pics of frontend app is

### 1.Transctions Table

![Transctions Table](<Screenshot (2).png>)

### 2.Transctions Statistics

![Transctions Statistics](<Screenshot (3).png>)

### 1.Transactions Bar Char

![Transactions Bar Char](<Screenshot (4).png>)
