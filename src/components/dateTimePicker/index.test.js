import DateTime from './index.js'

describe("设置最多可预约天数", () => {
    const expectValue = [
        {
            '2020': {
                '11': [8, 9]
            }
        },
        {
            '2020': {
                '11': traverseAll(8, 15)
            }
        },
        {
            '2020': {
                '11': traverseAll(8, 30),
                '12': [1]
            }
        },
        {
            '2020': {
                '11': traverseAll(8, 30),
                '12': traverseAll(1, 31)
            },
            '2021': {
                '1': [1]
            }
        },
        {
            '2020': {
                '11': traverseAll(8, 30),
                '12': traverseAll(1, 31)
            },
            '2021': {
                '1': [1, 2]
            }
        }
    ]
    test.each([
        [1, expectValue[0]],
        [7, expectValue[1]],
        [23, expectValue[2]],
        [54, expectValue[3]],
        [55, expectValue[4]],
    ])("最多预约%i天", (a, exptect) => {
        const d = new DateTime(1, '6:00', '23:00', a, '2020-11-08 5:00')
        
        expect(d.years).toEqual(exptect)
    })
})
describe.skip("选择第二天，改变小时", () => {
    test("最多预约7天，营业时间是6:00-18:00", () => {
        const d = new DateTime(0, '6:00', '18:00', 7, '2020-11-08')
        
        d.setCurrentDate(2020, 11, 9) // 先选择第二天
        const {year_instance: year, month_instance: month, day_instance: day, hour_instance: hour, minute_instance: minute} = d
        expect(year.toShow).toEqual(["2020"])
        expect(month.toShow).toEqual(["11"])
        expect(day.toShow).toEqual(traverseAll(8, 15))
        expect(hour.toShow).toEqual(traverseAll(6, 18))
        expect(minute.toShow[0]).toEqual(0)
        expect(minute.toShow[minute.toShow.length - 1]).toEqual(59)
        expect(year.selected_index).toBe(0)
        expect(month.selected_index).toBe(0)
        expect(day.selected_index).toBe(1)
        expect(hour.selected_index).toBe(0)
        expect(minute.selected_index).toBe(0)
    })
    const d = new DateTime(0, '6:30', '18:30', 7, '2020-11-08')
    
    d.setCurrentDate(2020, 11, 9)
    
    test.each([
        // @0 选择的几点 @1 选择的几点对应的索引 @2@3 对应的分钟列表的起始值 
        [6, 0, 30, 59],
        [12, 6, 0, 59],
        [18, 12, 0, 30],
        [18, 12, 0, 30]
    ])("用户选择了下一天的%i点", (selected_hour, selected_hour_index, minute_start, minute_end) => {
        d.setCurrentDate(2020, 11, 9, selected_hour)
        const {year_instance: year, month_instance: month, day_instance: day, hour_instance: hour, minute_instance: minute} = d
        expect(year.toShow).toEqual(["2020"])
        expect(month.toShow).toEqual(["11"])
        expect(day.toShow).toEqual(traverseAll(8, 15))
        expect(hour.toShow).toEqual(traverseAll(6, 18))
        expect(minute.toShow).toEqual(traverseAll(minute_start, minute_end))
        expect(year.selected_index).toBe(0)
        expect(month.selected_index).toBe(0)
        expect(day.selected_index).toBe(1)
        expect(hour.selected_index).toBe(selected_hour_index)
        expect(minute.selected_index).toBe(0)
    })
})
describe.skip("选择当天,改变小时", () => {
  const d = new DateTime(0, '6:35', '18:35', 7, '2020-11-08 5:36')
  
    test("初始化", () => {
        const {year_instance: year, month_instance: month, day_instance: day, hour_instance: hour, minute_instance: minute} = d
        expect(year.toShow).toEqual(["2020"])
        expect(month.toShow).toEqual(["11"])
        expect(day.toShow).toEqual(traverseAll(8, 15))
        expect(hour.toShow).toEqual(traverseAll(6, 18))
        expect(minute.toShow).toEqual(traverseAll(35, 59)) // 系统时间设为2020-11-8 6：36
        expect(year.selected_index).toBe(0)
        expect(month.selected_index).toBe(0)
        expect(day.selected_index).toBe(0)
        expect(hour.selected_index).toBe(0)
        expect(minute.selected_index).toBe(0)
    })
    test.each([
        // @0 选择的几点 @1 选的几点对应的索引 @2@3 对应的分钟列表
        [7, 1, 0, 59],
        [18, 12, 0, 35],
        [7, 1, 0, 59],
        [6, 0, 35, 59]
    ])("选择当天%i点", (selected_hour, selected_hour_index, minute_start, minute_end) => {
        d.setCurrentDate(2020, 11, 8, selected_hour)
        const {year_instance: year, month_instance: month, day_instance: day, hour_instance: hour, minute_instance: minute} = d
        expect(year.toShow).toEqual(["2020"])
        expect(month.toShow).toEqual(["11"])
        expect(day.toShow).toEqual(traverseAll(8, 15))
        expect(hour.toShow).toEqual(traverseAll(6, 18))
        expect(minute.toShow).toEqual(traverseAll(minute_start, minute_end)) // 系统时间设为2020-11-8 6：36
        expect(year.selected_index).toBe(0)
        expect(month.selected_index).toBe(0)
        expect(day.selected_index).toBe(0)
        expect(hour.selected_index).toBe(selected_hour_index)
        expect(minute.selected_index).toBe(0)
    })
    
})
describe.skip("选择当月，改变当月的天", () => {
    const d = new DateTime(0, '6:00', '18:00', 7, '2020-11-08 6:20')
    
    test("初始化", () => {
        const {year_instance: year, month_instance: month, day_instance: day, hour_instance: hour, minute_instance: minute} = d
        expect(year.toShow).toEqual(["2020"])
        expect(month.toShow).toEqual(["11"])
        expect(day.toShow).toEqual(traverseAll(8, 15))
        expect(hour.toShow).toEqual(traverseAll(6, 18))
        expect(minute.toShow).toEqual(traverseAll(20, 59)) // 系统时间设为2020-11-8 6：36
        expect(year.selected_index).toBe(0)
        expect(month.selected_index).toBe(0)
        expect(day.selected_index).toBe(0)
        expect(hour.selected_index).toBe(0)
        expect(minute.selected_index).toBe(0)
    })
    test.each([
        // @0选择的那一天 @1 选择天对应的索引 @2 小时列表的起始值
        [9, 1, 6, 18, 0],
        [8, 0, 6, 18, 20]
    ])("选择%i号", (seleted_day, selected_day_index, hour_start, hour_end, minute_start) => {
        d.setCurrentDate(2020, 11, seleted_day)
        const {year_instance: year, month_instance: month, day_instance: day, hour_instance: hour, minute_instance: minute} = d
        expect(year.toShow).toEqual(["2020"])
        expect(month.toShow).toEqual(["11"])
        expect(day.toShow).toEqual(traverseAll(8, 15))
        expect(hour.toShow).toEqual(traverseAll(hour_start, hour_end))
        expect(minute.toShow).toEqual(traverseAll(minute_start, 59))
        expect(year.selected_index).toBe(0)
        expect(month.selected_index).toBe(0)
        expect(day.selected_index).toBe(selected_day_index)
        expect(hour.selected_index).toBe(0)
        expect(minute.selected_index).toBe(0)
    })
})
describe.skip("选择第二个月，改变天", () => {
    const d = new DateTime(0, '6:00', '18:00', 30, '2020-11-08 6:20')
  d.setCurrentDate(2020, 12)
  
    test("初始化", () => {
        const {year_instance: year, month_instance: month, day_instance: day, hour_instance: hour, minute_instance: minute} = d
        expect(year.toShow).toEqual(["2020"])
        expect(month.toShow).toEqual(["11", "12"])
        expect(day.toShow).toEqual(traverseAll(1, 8))
        expect(hour.toShow).toEqual(traverseAll(6, 18))
        expect(minute.toShow).toEqual(traverseAll(0, 59)) // 系统时间设为2020-11-8 6：36
        expect(year.selected_index).toBe(0)
        expect(month.selected_index).toBe(1)
        expect(day.selected_index).toBe(0)
        expect(hour.selected_index).toBe(0)
        expect(minute.selected_index).toBe(0)
    })
    test.each([
        // @0选择的那一天 @1 选择天对应的索引 @2 小时列表的起始值
        [2, 1, 6, 18],
    ])("选择第%i个天", (selected_day, selected_day_index, hour_start, hour_end) => {
        d.setCurrentDate(2020, 12, selected_day)
        const {year_instance: year, month_instance: month, day_instance: day, hour_instance: hour, minute_instance: minute} = d
        expect(year.toShow).toEqual(["2020"])
        expect(month.toShow).toEqual(["11", "12"])
        expect(day.toShow).toEqual(traverseAll(1, 8))
        expect(hour.toShow).toEqual(traverseAll(hour_start, hour_end))
        expect(minute.toShow).toEqual(traverseAll(0, 59))
        expect(year.selected_index).toBe(0)
        expect(month.selected_index).toBe(1)
        expect(day.selected_index).toBe(selected_day_index)
        expect(hour.selected_index).toBe(0)
        expect(minute.selected_index).toBe(0)
    })
})

describe.skip("选择当天，设置时间间隔2小时，改变当前时间", () => {
    test("营业时间是6:00-18:00，当前时间在开始营业时间两小时前（0:00-4:00）", () => {
        const d = new DateTime(2, '6:00', '18:00', 7, '2020-11-08 02:59')
        const {year_instance: year, month_instance: month, day_instance: day, hour_instance: hour, minute_instance: minute} = d
        expect(year.toShow).toEqual(["2020"])
        expect(month.toShow).toEqual(["11"])
        expect(day.toShow).toEqual(traverseAll(8, 15))
        expect(hour.toShow).toEqual(traverseAll(6, 18))
        expect(minute.toShow[0]).toEqual(0)
        expect(minute.toShow[minute.toShow.length - 1]).toEqual(59)
    })
    test("营业时间是6:00-18:00，当前时间在开始营业时间两小时之前（4:00-6:00）但在结束营业时间前的两小时之前（6:00-16:00）【4:00-16:00】", () => {
        const d = new DateTime(2, '6:00', '18:00', 7, '2020-11-08 15:30')
        const {year_instance: year, month_instance: month, day_instance: day, hour_instance: hour, minute_instance: minute} = d
        expect(year.toShow).toEqual(["2020"])
        expect(month.toShow).toEqual(["11"])
        expect(day.toShow).toEqual(traverseAll(8, 15))
        expect(hour.toShow).toEqual(traverseAll(17, 18))
        expect(minute.toShow[0]).toEqual(30)
        expect(minute.toShow[minute.toShow.length - 1]).toEqual(59)
    })
    test("营业时间是6:00-18:00，当前时间在结束营业时间前的两小时以内（16：00-18：00）或结束营业时间之后（18：00-24：00）", () => {
        const d = new DateTime(2, '6:00', '18:00', 7, '2020-11-08 16:01')
        const {year_instance: year, month_instance: month, day_instance: day, hour_instance: hour, minute_instance: minute} = d
        expect(year.toShow).toEqual(["2020"])
        expect(month.toShow).toEqual(["11"])
        expect(day.toShow).toEqual(traverseAll(8, 15))
        expect(hour.toShow).toEqual([])
        expect(minute.toShow).toEqual([])
    })
    
})
function traverseAll(start, end) {
    let result = []
    for(let m = Number(start); m <= end; m++) {
        result.push(m)
    }
    return result
}
function forUnitTest(date) {
    date.toShowYeas = date.year_instance.toShow
    date.toShowMonths = date.month_instance.toShow
    date.toShowDays = date.day_instance.toShow
    date.toShowHours = date.hour_instance.toShow
    date.toShowMinutes = date.minute_instance.toShow

    date.selected_year_index = date.year_instance.selected_index
    date.selected_month_index = date.month_instance.selected_index
    date.selected_day_index = date.day_instance.selected_index
    date.selected_hour_index = date.hour_instance.selected_index
    date.selected_minute_index = date.minute_instance.selected_index
}
