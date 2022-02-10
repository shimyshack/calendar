import { mount } from '@vue/test-utils'
import Calendar from '../components/Calendar/Calendar.vue'

describe('Calendar', () => {
  // Single selection
  test('default props', () => {
    const wrapper = mount(Calendar, {
      props: {},
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
  test('single date mode', () => {
    const wrapper = mount(Calendar, {
      props: {
        modelValue: new Date('2021-01-26 3:35:00')
      },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
  // test('single dateTime mode', () => {
  //   const wrapper = mount(Calendar, {
  //     props: {
  //       modelValue: new Date('2021-01-26 3:35:00'),
  //       mode: 'dateTime'
  //     },
  //   })
  //   expect(wrapper.html()).toMatchSnapshot()
  // })
  // test('single time mode', async () => {
  //   expect(Calendar).toBeTruthy()
  //   const wrapper = mount(Calendar, {
  //     props: {
  //       modelValue: new Date('2021-01-26 3:35:00'),
  //       mode: 'time'
  //     },
  //   })
  //   expect(wrapper.html()).toMatchSnapshot()
  // })

  // Range selection
  test('range default props', async () => {
    expect(Calendar).toBeTruthy()
    const wrapper = mount(Calendar, {
      props: {
        modeValue: { start: null, end: null }
      },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
  test('range date mode', async () => {
    expect(Calendar).toBeTruthy()
    const wrapper = mount(Calendar, {
      props: {
        modelValue: { start: new Date('2021-01-26 3:35:00'), end: new Date('2021-02-10 15:35:00') },
        min: new Date('2021-01-03 00:00:00'),
        max: new Date('2021-02-24 00:00:00')
      },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
  // test('range dateTime mode', async () => {
  //   expect(Calendar).toBeTruthy()
  //   const wrapper = mount(Calendar, {
  //     props: {
  //       modelValue: { start: new Date('2021-01-26 3:35:00'), end: new Date('2021-02-10 15:35:00') },
  //       mode: 'dateTime'
  //     },
  //   })
  //   expect(wrapper.html()).toMatchSnapshot()
  // })
  // test('range time mode', async () => {
  //   expect(Calendar).toBeTruthy()
  //   const wrapper = mount(Calendar, {
  //     props: {
  //       modelValue: { start: new Date('2021-01-26 3:35:00'), end: new Date('2021-02-10 15:35:00') },
  //       mode: 'time'
  //     },
  //   })
  //   expect(wrapper.html()).toMatchSnapshot()
  // })
})