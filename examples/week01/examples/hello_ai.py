# 我的第一个 Python 程序
name = "小明"
daily_hours = [2, 3, 1, 4, 2, 3, 5]
total = sum(daily_hours)
average = total / len(daily_hours)

print("你好，" + name + "！")
print("本周总学习时间：", total, "小时")
print("平均每天学习：", round(average, 1), "小时")

if average >= 3:
    print("学习时间比较充足！")
else:
    print("可以尝试合理安排更多学习时间。")
