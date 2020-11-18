let years = {}
let date = null
export default function DateTime(interval = 1, startTime = '6:00', endTime = '23:00', bookDuration = 7, setDate) {
    debugger
    this.bookDuration = bookDuration + 1 // 假如今天是11-08 5:00 bookDuration是2那么应该是到11-11 5:00
    this.interval = interval
    this.startTime = startTime
    this.startTime_H_M = startTime.split(':') // 6:00 -> [6, 0]
    this.endTime = endTime
    this.endTime_H_M = endTime.split(':')
    this.years = {}
    date = setDate ? (new Date(setDate)) : (new Date())
    date.setHours(date.getHours() + interval)
    this.setDateRange()
    this.year_instance = new Year()
    this.month_instance = new Month()
    this.day_instance = new Day()
    this.hour_instance = new Hour()
    this.minute_instance = new Minute()
    this.init()
}
DateTime.prototype.init = function() {
    const firstYear = date.getFullYear()
    this.setCurrentDate(firstYear)
}
// 设置年月日的范围，存入this.years
DateTime.prototype.setDateRange = function() {
    let bookDuration = this.bookDuration
    // 根据bookDuration算出最早时间和最晚时间所对应的年份
    date.setDate(date.getDate() + bookDuration)
    const maxTimestramp = date.getTime()
    const maxYear = date.getFullYear()

    date.setDate(date.getDate() - bookDuration)
    const minTimestramp = date.getTime()
    const minYear = date.getFullYear()
    

    years = this.years = {} // bookDuration范围内的所有年月日
    const temp = bookDuration
    for(let year = minYear; year <= maxYear; year++) {
        const _year = years[year] = {}
        while(bookDuration > 0) { // 把月份安排进去
            const month = date.getMonth() + 1
            // 判断获取的当前月份cur和上轮while获取的月份pre，如果cur小于pre则说明已经切换为下一年了，则退出while，开始安排明年的月份
            const months = Object.keys(_year)
            const len = months.length
            if(len) {
                if(months[len - 1] > month) {
                    break;
                }
            }
            const _month = _year[month] = []

            while(bookDuration > 0) { // 把天安排进去
                const day = date.getDate()
                // 同月份的判断逻辑
                const len = _month.length
                if(len) {
                    if(_month[len - 1] > day) { // 已经切换到下个月了
                        break;
                    }
                }
                _month.push(day)
                date.setDate(day + 1)
                bookDuration --
            }
            if(_month.length === 0) { // 如果本轮月份地下没有日，则本年不显示本月
                delete _year[_month]
            }
        }
        if(Object.keys(_year).length === 0) {// 如果本年底下没有月，则本年不显示
            delete years[year]
        }
    }
    // console.warn(years)
    date.setDate(date.getDate() - temp)
}
// 选择年、月、日后选择器年月日的变化
DateTime.prototype.setCurrentDate = function(year, month, day, hour, minute){
    if(this.year_instance.seleted != year) { // 年改变，月日时分都要重置为选择第一个
        this.year_instance.reset(year)
        const { selected_month } = this.month_instance.getList(year)
        const { selected_day } = this.day_instance.getList(year, selected_month)
        const { selected_hour, toShowHours } = this.hour_instance.getList(year, selected_month, selected_day, this)
        this.minute_instance.getList(year, selected_month, selected_day, selected_hour, toShowHours, this)
        return
    }
    if(this.month_instance.selected != month) { // 月改变，日时分都要重置为选择第一个
        this.month_instance.reset(month)
        const { selected_day } = this.day_instance.getList(year, month)
        const { selected_hour, toShowHours } = this.hour_instance.getList(year, selected_month, selected_day, this)
        this.minute_instance.getList(year, month, selected_day, selected_hour, toShowHours, this)
        return
    }
    if(this.day_instance.selected != day) { // 日改变，时分都要重置为选择第一个
        this.day_instance.reset(day)
        const { selected_hour, toShowHours } = this.hour_instance.getList(year, month, day, this)
        this.minute_instance.getList(year, month, day, selected_hour, toShowHours, this)
        return
    }
    if(this.hour_instance.selected != hour) { // 时改变，分要重置为选择第一个
        this.hour_instance.reset(hour)
        this.minute_instance.getList(year, month, day, hour, this.hour_instance.toShow, this)
        return
    }
    if(this.minute_instance.seleted != minute) {
        this.minute_instance.reset(minute)
        return
    }
}
function Year() {
    this.seleted = ''
    this.selected_index = 0
    this.toShow = Object.keys(years)
    return this
}
Year.prototype.getList = function() {
    this.toShow = Object.keys(years)
    this.seleted = this.toShow.length ? this.toShow[0] : ''
    return {seleted_year: this.seleted}
}
Year.prototype.reset = function(year) {
    this.seleted = year
    this.selected_index = this.toShow.findIndex(item => item == year)
}
function Month() {
    this.selected = ''
    this.selected_index = 0
    this.toShow = []
    return this
}
Month.prototype.getList = function(year) {
    this.toShow = Object.keys(years[year])
    this.selected = this.toShow.length ? this.toShow[0] : ''
    return {selected_month: this.selected}
}
Month.prototype.reset = function(month) {
    this.selected = month
    this.selected_index = this.toShow.findIndex(item => item == month)
}
function Day() {
    this.selected = ''
    this.selected_index = 0
    this.toShow = []
}
Day.prototype.getList = function(year, month){
    this.toShow = years[year][month]
    this.selected = this.toShow.length ? this.toShow[0] : ''
    return {selected_day: this.selected}
}
Day.prototype.reset = function(day) {
    this.selected = day
    this.selected_index = this.toShow.findIndex(item => item == day)
}
function Hour() {
    this.selected = ''
    this.selected_index = 0
    this.toShow = []
}
Hour.prototype.getList = function(year, month, day, context) {
    this.toShow = []
    const nowDate = date.getFullYear() + '' + (date.getMonth() + 1) + '' + date.getDate()
    const changedDate = year + '' + month + '' + day
    if(nowDate === changedDate) { // 用户选择的日期正好是今天，
        const hour = date.getHours() + context
        const minute = date.getMinutes()
        if(hour <= context.startTime_H_M[0]) { // 当前的时间小时在开始营业小时之前，应该是开始、结束营业时间的小时
            traverseAll(context.startTime_H_M[0], context.endTime_H_M[0], this.toShow)
        } else if(hour <= context.endTime_H_M[0]) { // 当前的小时在开始营业小时或之后，并且是结束时间的小时之前，应该是当前的小时到结束营业时间的小时
            if(hour == context.endTime_H_M[0]) {
                if(minute < context.endTime_H_M[1]) {
                    traverseAll(hour, context.endTime_H_M[0], this.toShow)
                } else {
                    this.toShow = []
                }
            } else {
                traverseAll(hour, context.endTime_H_M[0], this.toShow)
            }
        } else { // 当前的小时在结束营业时间之后，应该是返回空数组
            this.toShow = []
        }

    } else { // 用户选择的日期不是今天，返回开始、结束营业时间的小时
        traverseAll(context.startTime_H_M[0], context.endTime_H_M[0], this.toShow)
    }
    this.selected = this.toShow.length ? this.toShow[0] : ''
    return {selected_hour: this.selected, toShowHours: this.toShow}
}
Hour.prototype.reset = function(hour) {
    this.selected = hour
    this.selected_index = this.toShow.findIndex(item => item == hour)
}
function Minute() {
    this.seleted = ''
    this.selected_index = 0
    this.toShow = []
}
Minute.prototype.getList = function(year, month, day, hour, toShowHours, context) {
    this.toShow = []
    if(toShowHours.length === 0){ // 小时返回空数组，分钟也返回空数组
        return
    }
    const nowDate = date.getFullYear() + '' + (date.getMonth() + 1) + '' + date.getDate()
    const changedDate = year + '' + month + '' + day

    if(nowDate === changedDate) { // 用户选择的日期正好是今天
        const nowMinuts = date.getMinutes()
        const nowHours = date.getHours()
        const minutes = nowHours * 60 + nowMinuts // 当前小时分钟换算为分钟
        const start_minutes = context.startTime_H_M[0] * 60 + Number(context.startTime_H_M[1]) // 开始营业时间换算为分钟
        const end_minutes = context.endTime_H_M[0] * 60 // 结束营业时间的时换算为分钟
        
        if(hour == context.startTime_H_M[0]) { // 用户选择的小时在开始营业时间的的那个小时
            if(minutes < start_minutes) { // 当前分钟在开始营业时间的分钟之前，应该是开始营业时间的分钟-59分
                traverseAll(context.startTime_H_M[1], 59, this.toShow)
            } else { // 当前分钟在开始营业时间的分钟之后，应该是当前分钟-59
                traverseAll(nowMinuts, 59, this.toShow)
            }
        } else if(hour < context.endTime_H_M[0]) { // 用户选择的小时在开始营业时间的那个小时和结束营业时间的那个小时之间,应该是当前分钟-59
            if(nowHours < hour) {
              traverseAll(0, 59, this.toShow)   
            } else {
                traverseAll(nowMinuts, 59, this.toShow)
            }
        } else if(hour == context.endTime_H_M[0]){ // 用户选择的小时在结束营业时间的那个小时
            if(minutes < end_minutes) { // 当前分钟在结束营业时间的分钟之前，应该当前分钟-结束营业时间的分钟
                traverseAll(0, context.endTime_H_M[1], this.toShow)
            } else { // 当前分钟在结束营业时间的分钟之后，应该是00-结束营业时间的分钟
                traverseAll(nowMinuts, context.endTime_H_M[1], this.toShow)
            }
        }
    } else { // 用户选择的日期不是今天
        if(hour == context.startTime_H_M[0]) { // 用户选择的小时在开始营业时间的的那个小时，应该是开始营业时间的分钟-59分
            traverseAll(context.startTime_H_M[1], 59, this.toShow)
        } else if(hour < context.endTime_H_M[0]) { // 用户选择的小时在开始营业时间的那个小时和结束营业时间的那个小时之间，应该是0分-59分
            traverseAll(0, 59, this.toShow)
        } else if(hour == context.endTime_H_M[0]){ // 用户选择的小时在结束营业时间的那个小时，应该是00-结束营业时间的分钟
            traverseAll(0, context.endTime_H_M[1], this.toShow)
        }
    }
    this.seleted = this.toShow.length ? this.toShow[0] : 0
    return {seleted_minute: this.seleted}
}
Minute.prototype.reset = function(minute) {
    this.seleted = minute
    this.selected_index = this.toShow.findIndex(item => item == minute)
}
function traverseAll(start, end, result) {
    for(let m = Number(start); m <= end; m++) {
        result.push(m)
    }
}