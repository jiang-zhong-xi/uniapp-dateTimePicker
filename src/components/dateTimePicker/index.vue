<template>
    <view class="layor" v-if="show">
        <view class="date_time_picker">
            <view class="actions">
                <text @tap="cancel">取消</text>
                <text>选择时间</text>
                <text @tap="sure">确定</text>
            </view>
            <picker-view v-if="true" :indicator-style="indicatorStyle" :value="value" @change="bindChange">
                <picker-view-column>
                    <view class="item" v-for="(item,index) in years" :key="index">{{item | attachZero}}</view>
                </picker-view-column>
                <picker-view-column>
                    <view class="item" v-for="(item,index) in months" :key="index">{{item | attachZero}}</view>
                </picker-view-column>
                <picker-view-column>
                    <view class="item" v-for="(item,index) in days" :key="index">{{item | attachZero}}</view>
                </picker-view-column>
				<picker-view-column>
                    <view class="item" v-for="(item,index) in hours" :key="index">{{item | attachZero}}</view>
                </picker-view-column>
				<picker-view-column>
                    <view class="item" v-for="(item,index) in minutes" :key="index">{{item | attachZero}}</view>
                </picker-view-column>
            </picker-view>
        </view>
    </view>
</template>
<script lang="ts">
	import Vue from 'vue'
	import DateTime from './index.js'
	let dateTime: any = {}
	const date = new Date()

	export default Vue.extend( {
		props: {
			interval: {
				type: Number,
				default: 0
			},
			startTime: {
				type: String,
				default: ''
			},
			endTime: {
				type: String,
				default: ''
			},
			bookDuration: {
				type: Number,
				default: 0
			},
			pickerShow: {
				type: Boolean,
				default: false
			}
		},
		filters: {
			attachZero(number: number) {
				return ('' + number).padStart(2, '0') 
			}
		},
		watch: {
			pickerShow() {
				this.show = true
			},
			show() {
				dateTime = new DateTime(this.interval, this.startTime, this.endTime, this.bookDuration)
				const {year_instance: year, month_instance: month, day_instance: day, hour_instance: hour, minute_instance: minute} = dateTime
				this.years = year.toShow
				this.months = month.toShow
				this.days = day.toShow
				this.hours = hour.toShow
				this.minutes = minute.toShow
				this.value = [0,0,0,0,0]
			}
		},
		data: function () {
        return {
			show: false,
			years: [],
			months: [],
			days: [],
			hours: [],
			minutes: [],
			value: [0,0,0,0,0]
        }
		},
    methods: {
        bindChange: function (e: any) {
            const val = e.detail.value
            const year_selected = this.years[val[0]]
            const month_selected = this.months[val[1]]
			const day_selected = this.days[val[2]]
			const hour_selected = this.hours[val[3]]
			const minute_selected = this.minutes[val[4]]
			dateTime.setCurrentDate(year_selected, month_selected, day_selected, hour_selected, minute_selected)

			const {year_instance: year, month_instance: month, day_instance: day, hour_instance: hour, minute_instance: minute} = dateTime
			this.years = year.toShow
			this.months = month.toShow
			this.days = day.toShow
			this.hours = hour.toShow
			this.minutes = minute.toShow
			this.value = [
				year.selected_index,
				month.selected_index,
				day.selected_index,
				hour.selected_index,
				minute.selected_index
			]
		},
		cancel() {
			this.show = false
		},
		sure() {
			this.cancel()
			// 如果存在某项时间列表为空，说明用户之前的选择无效
			if(this.years.length === 0 || this.months.length === 0 || this.days.length === 0 
			|| this.hours.length === 0 || this.minutes.length === 0) {
				return
			}
			const year = this.years[this.value[0]] + ''
			let month = this.months[this.value[1]] + ''
			let day = this.days[this.value[2]] + ''
			let hour = this.hours[this.value[3]] + ''
			let minute = this.minutes[this.value[4]] + ''
			month = month.padStart(2, '0')
			day = day.padStart(2, '0')
			hour = hour.padStart(2, '0')
			minute = minute.padStart(2, '0')
			this.$emit('sure', {year, month, day, hour, minute})
		}
	}
})
</script>
<style>
.layor {
	background: rgba(0, 0, 0, 0.5);
	position: fixed;
	width: 100vw;
	height: 100vh;
	left: 0upx;
	top: 0upx;
}
.date_time_picker {
	background: #FFFFFF;
	position: absolute;
	height: 586rpx;
	bottom: 0upx;
	left: 0upx;
	right: 0upx;
}

.date_time_picker .actions {
	display: flex;
	justify-content: space-between;
	height: 44px;
	line-height: 44px;
}
.actions :nth-child(1) {
	color: #969799;
	padding: 0 16px;
	font-size: 14px;
}
.actions :nth-child(2) {
	max-width: 50%;
	text-align: center;
	font-weight: 500;
	font-size: 16px;
}
.actions :nth-child(3) {
	color: #576b95;
	padding: 0 16px;
	font-size: 14px;
}
uni-picker-view {
  display: block;
}

uni-picker-view .uni-picker-view-wrapper {
  display: flex;
  position: relative;
  overflow: hidden;
  height: 100%;
  background-color: white;
}

uni-picker-view[hidden] {
  display: none;
}

picker-view {
    width: 100%;
    height: 600upx;
    margin-top:20upx;
}
picker-view .item {
	display: flex;
	align-items: center;
}
</style>