<template>
	<view class="content">
        <image class="logo" src="../../static/logo.png"></image>
		<view @click="pickerShow = !pickerShow">
            <text class="title">{{title}}</text>
        </view>
		<DateTimePicker 
            :interval="1"
            startTime="6:35"
            endTime="21:35"
            :bookDuration="7"
			:pickerShow="pickerShow"
			@sure="sure"
        />
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import DateTimePicker from '@/components/dateTimePicker/index.vue'
	export default Vue.extend({
		components: { DateTimePicker },
		data() {
			return {
				title: 'Hello',
				pickerShow: false
			}
		},
		onLoad() {

		},
		methods: {
			sure(e: any) {
				debugger
				const {year, month, day, hour, minute} = e
                const date = new Date()
                date.setFullYear(year)
                date.setMonth(month)
				date.setDate(day)
				date.setHours(hour)
				date.setMinutes(minute)
				date.setSeconds(0)
				console.warn('当前选择时间', e)
			}
		}
	});
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin: 200rpx auto 50rpx auto;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
