import { useBizUiMsg } from '@magustek/framework-biz-ui'
import { useMgUiMsg } from '@magustek/framework-ui'

const i18n = createI18n({ locale: 'cn', messages: {} })

i18n.mergeLocalMessages(useMgUiMsg())
i18n.mergeLocalMessages(useBizUiMsg())
i18n.withGlobalLocale()

export { i18n }
