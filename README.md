### 可设置参数含义

##### 可预约服务的时间区间

开始服务时间（startTime）-结束服务时间（endTime），比如10:00-22:00，包含以下逻辑：

1. 对于用户选择隔天订单，则只能选择这个区间的时间。
2. 如果用户选择今天的订单，则包含以下情况：
   1. 如果当前时间早于开始服务时间（startTime），则用户可选择这个区间内的任何时间。
   2. 如果当前时间处于这个区间内，则用户可以选择当前时间到结束服务时间内的任何时间。
   3. 如果当前时间晚于结束服务时间（endTime），则用户不能再选择今天的时间。

##### 是否可预约隔天服务订单

如果选择是，则设置间隔几天，比如设置了间隔3天（bookDuring=3），今天是17号，那么用户能选择17-20号这几天的订单；如果选择否（bookDuring=0），比如今天是17号，那么用户只能选择今天的订单。

##### 最早可预约N小时后的服务订单

只对预约今天订单有影响，需要保证当前时间 + N小时（interval=N）在可预约服务的时间区间内。

