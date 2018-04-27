# MiniProg
使用Node 搭建的微信小程序后台

工具见package.json即可

# 微信小程序——吃什么
1. 学生：注册后根据所在学校每天为其推荐午餐晚餐

2. 食堂：注册后上传餐厅的各种菜品

3. 菜品：菜名、价格、位置（学校， 食堂）

# RESTful API

## **多条件查询（返回多组数据，目前仅支持 按学校和食堂查询）**

    GET /dishes/:school/:canteen
### 返回值（json）：

    {
        "dishes": [{
            "_id": "dish id",
            "school": "school",
            "canteen": "canteen",
            "name": "dish name",
            "price": number
        },
        ...
        ]
    }
### 错误： 
> 错误码: 400

> 错误原因: 我也不知道

## **按ID查询（仅返回一组数据）:**
    GET /dishes/:school/:canteen/:dish_id
### 返回值（json）：

    {
        "dish":{
            "_id": "dish id",
            "school": "school",
            "canteen": "canteen",
            "name": "dish name",
            "price": number
        }
    }
### 错误：
> 错误码：401

> 错误原因：URL内未指定ID，若无需指定，请使用 *多条件查询*

> 错误码：400

> 错误原因：数据库未找到指定ID的数据

## **添加**
    POST /dishes/:school/:canteen
    Content-Type : application/json
    body: {
        "name": "dish name",
        "price": "dish price"
    }
### 返回值（json）：
    {
        "obj": {
            "_id": "id",
            "school": "school",
            "canteen": "canteen",
            "name": "dish name",
            "price": number
        },
        "id": "id"
    }
### 错误：
> 错误码：400

> 错误原因：未指定 字段 "name"或"price"或指定值为空
    

## **删除**
    DELETE /dishes/:school/:canteen/:dish_id
    Content-Type : application/json
    body: {
        "name": "dish name",
        "price": "dish price"
    }
### 返回值
（暂无）

### 错误
> 错误码：400

> 错误原因：未找到可删除的数据，请仔细检查 传入的id

> 错误码：401

> 错误原因：为指明id或指定id不合法