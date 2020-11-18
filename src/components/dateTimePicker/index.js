export default function DateTime(interval = 1, startTime = '6:00', endTime = '23:00', bookDuration = 7, setDate) {
    this.bookDuration = bookDuration + 1 // 假如今天是11-08 5:00 bookDuration是2那么应该是到11-11 5:00
    this.interval = interval
    this.startTime = startTime
    this.startTime_H_M = startTime.split(':') // 6:00 -> [6, 0]
    this.endTime = endTime
    this.endTime_H_M = endTime.split(':')
    this.years = {}
    const date = this.date = setDate ? (new Date(setDate)) : (new Date())
    date.setHours(date.getHours() + interval)
    // 选择的年月日时，据此得出选择器显示的年月日时分（默认是此时）
    this.seleted_year = ''
    this.selected_month = ''
    this.selected_day = ''
    this.selected_hour = ''
    this.seleted_minute = ''
    this.selected_year_index = 0
    this.selected_month_index = 0
    this.selected_day_index = 0
    this.selected_hour_index = 0
    this.selected_minute = 0
    // 要显示的年列表、月列表、日列表、时列表、分列表
    this.toShowYeas = []
    this.toShowMonths = []
    this.toShowDays = []
    this.toShowHours = []
    this.toShowMinutes = []

    this.setDateRange()
    this.init()
}
DateTime.prototype.init = function() {
    const firstYear = this.date.getFullYear()
    const firstMonth = this.date.getMonth() + 1
    const fistDay = this.date.getDate()
    const firstHour = this.date.getHours()
    const firstMinute = this.date.getMinutes()
    this.setCurrentDate(firstYear, firstMonth, fistDay, firstHour, firstMinute)
}
// 设置年月日的范围，存入this.years
DateTime.prototype.setDateRange = function() {
    const date = this.date
    let bookDuration = this.bookDuration
    // 根据bookDuration算出最早时间和最晚时间所对应的年份
    date.setDate(date.getDate() + bookDuration)
    const maxTimestramp = date.getTime()
    const maxYear = date.getFullYear()

    date.setDate(date.getDate() - bookDuration)
    const minTimestramp = date.getTime()
    const minYear = date.getFullYear()
    

    const years = this.years = {} // bookDuration范围内的所有年月日
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
    this.setSelectedIndex(year, month, day, hour, minute)
    const years = this.toShowYeas = Object.keys(this.years)
    const months = this.toShowMonths = Object.keys(this.years[year])
    const days = this.toShowDays = this.years[year][month]
    if(this.seleted_year != year) { // 年改变，月日时分都要重置为选择第一个
        this.seleted_year = year
        this.selected_month = months.length ? months[0] : ''
        this.selected_day = days.length ? days[0] : ''
        if(years.length && months.length && days.length) {
            this.toShowHours = []
            this.toShowMinutes = []
            this.setCurrentHour()
            this.selected_month_index = 0
            this.selected_day_index = 0
            this.selected_hour_index = 0
            this.selected_minute_index = 0
            return 
        }
    }
    if(this.selected_month != month) { // 月改变，日时分都要重置为选择第一个
        this.selected_month = month
        this.selected_day = days.length ? days[0] : ''
        if(years.length && months.length && days.length) {
            this.toShowHours = []
            this.toShowMinutes = []
            this.setCurrentHour()
            this.selected_day_index = 0
            this.selected_hour_index = 0
            this.selected_minute_index = 0
            return 
        }
    }
    if(this.selected_day != day) { // 日改变，时分都要重置为选择第一个
        this.selected_day = day
        if(years.length && months.length && days.length) {
            this.toShowHours = []
            this.toShowMinutes = []
            this.setCurrentHour()
            this.selected_hour_index = 0
            this.selected_minute_index = 0
            return 
        }
    }
    if(this.selected_hour != hour) { // 时改变，分要重置为选择第一个
        this.selected_hour = hour
        this.toShowMinutes = []
        this.setCurrentMinute()
        this.selected_minute_index = 0
        return
    }
    if(this.seleted_minute != minute) {
        this.seleted_minute = minute
    }
}
DateTime.prototype.setSelectedIndex = function(year, month, day, hour, minute){
    const _year = this.toShowYeas.findIndex(item => item == year)
    this.selected_year_index = _year > 0 ? _year : 0
    const _month = this.toShowMonths.findIndex(item => item == month)
    this.selected_month_index = _month > 0 ? _month : 0
    const _day = this.toShowDays.findIndex(item => item == day)
    this.selected_day_index = _day > 0 ? _day : 0
    const _hour = this.toShowHours.findIndex(item => item == hour)
    this.selected_hour_index = _hour > 0 ? _hour : 0
    const _minute = this.toShowMinutes.findIndex(item => item == minute)
    this.selected_minute_index = _minute > 0 ? _minute : 0
}
DateTime.prototype.setCurrentHour = function() {
    const date = this.date
    const year = this.seleted_year
    const month = this.selected_month
    const day = this.selected_day
    const nowDate = date.getFullYear() + '' + (date.getMonth() + 1) + '' + date.getDate()
    const changedDate = year + '' + month + '' + day
    if(nowDate === changedDate) { // 用户选择的日期正好是今天，
        const hour = date.getHours()
        const minute = date.getMinutes()
        if(hour <= this.startTime_H_M[0]) { // 当前的时间小时在开始营业小时之前，应该是开始、结束营业时间的小时
            traverseAll(this.startTime_H_M[0], this.endTime_H_M[0], this.toShowHours)
        } else if(hour <= this.endTime_H_M[0]) { // 当前的小时在开始营业小时或之后，并且是结束时间的小时之前，应该是当前的小时到结束营业时间的小时
            if(hour == this.endTime_H_M[0]) {
                if(minute < this.endTime_H_M[1]) {
                    traverseAll(hour, this.endTime_H_M[0], this.toShowHours)
                } else {
                    this.toShowHours = []
                }
            } else {
                traverseAll(hour, this.endTime_H_M[0], this.toShowHours)
            }
        } else { // 当前的小时在结束营业时间之后，应该是返回空数组
            this.toShowHours = []
        }

    } else { // 用户选择的日期不是今天，返回开始、结束营业时间的小时
        traverseAll(this.startTime_H_M[0], this.endTime_H_M[0], this.toShowHours)
    }
    this.selected_hour = this.toShowHours.length ? this.toShowHours[0] : 1
    this.setCurrentMinute()
}// 6:24 18:24
DateTime.prototype.setCurrentMinute = function() {
    
    if(this.toShowHours.length === 0){ // 小时返回空数组，分钟也返回空数组
        this.toShowMinutes = []
        return
    }
    const date = this.date
    const nowDate = date.getFullYear() + '' + (date.getMonth() + 1) + '' + date.getDate()
    const year = this.seleted_year
    const month = this.selected_month
    const day = this.selected_day
    const changedDate = year + '' + month + '' + day

    if(nowDate === changedDate) { // 用户选择的日期正好是今天
        const nowMinuts = date.getMinutes()
        const nowHours = date.getHours()
        const minutes = nowHours * 60 + nowMinuts // 当前小时分钟换算为分钟
        const start_minutes = this.startTime_H_M[0] * 60 + Number(this.startTime_H_M[1]) // 开始营业时间换算为分钟
        const end_minutes = this.endTime_H_M[0] * 60 // 结束营业时间的时换算为分钟
        
        if(this.selected_hour == this.startTime_H_M[0]) { // 用户选择的小时在开始营业时间的的那个小时
            if(minutes < start_minutes) { // 当前分钟在开始营业时间的分钟之前，应该是开始营业时间的分钟-59分
                traverseAll(this.startTime_H_M[1], 59, this.toShowMinutes)
            } else { // 当前分钟在开始营业时间的分钟之后，应该是当前分钟-59
                traverseAll(nowMinuts, 59, this.toShowMinutes)
            }
        } else if(this.selected_hour < this.endTime_H_M[0]) { // 用户选择的小时在开始营业时间的那个小时和结束营业时间的那个小时之间,应该是当前分钟-59
            if(nowHours < this.selected_hour) {
              traverseAll(0, 59, this.toShowMinutes)   
            } else {
                traverseAll(nowMinuts, 59, this.toShowMinutes)
            }
        } else if(this.selected_hour == this.endTime_H_M[0]){ // 用户选择的小时在结束营业时间的那个小时
            if(minutes < end_minutes) { // 当前分钟在结束营业时间的分钟之前，应该当前分钟-结束营业时间的分钟
                traverseAll(0, this.endTime_H_M[1], this.toShowMinutes)
            } else { // 当前分钟在结束营业时间的分钟之后，应该是00-结束营业时间的分钟
                traverseAll(nowMinuts, this.endTime_H_M[1], this.toShowMinutes)
            }
        }
    } else { // 用户选择的日期不是今天
        if(this.selected_hour == this.startTime_H_M[0]) { // 用户选择的小时在开始营业时间的的那个小时，应该是开始营业时间的分钟-59分
            traverseAll(this.startTime_H_M[1], 59, this.toShowMinutes)
        } else if(this.selected_hour < this.endTime_H_M[0]) { // 用户选择的小时在开始营业时间的那个小时和结束营业时间的那个小时之间，应该是0分-59分
            traverseAll(0, 59, this.toShowMinutes)
        } else if(this.selected_hour == this.endTime_H_M[0]){ // 用户选择的小时在结束营业时间的那个小时，应该是00-结束营业时间的分钟
            traverseAll(0, this.endTime_H_M[1], this.toShowMinutes)
        }
    }
    this.seleted_minute = this.toShowMinutes.length ? this.toShowMinutes[0] : 0
}
function traverseAll(start, end, result) {
    for(let m = Number(start); m <= end; m++) {
        result.push(m)
    }
}