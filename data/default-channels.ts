import { generateId } from "@/lib/utils"
import type { Channel, ConditionGroup, Condition } from "@/types"

const createEmptyCondition = (): Condition => ({
  id: generateId(),
  property: "UTM_Source",
  conditionType: "contains",
  value: "",
})

const createEmptyConditionGroup = (): ConditionGroup => ({
  id: generateId(),
  conditions: [createEmptyCondition()],
  operator: "AND",
})

// Create a new channel with the specified name
export const createEmptyChannel = (name = "New Channel"): Channel => ({
  id: generateId(),
  name,
  conditionGroups: [createEmptyConditionGroup()],
  groupOperator: "OR",
})

// This function creates all the default channels based on the example Mixpanel code
export const getDefaultChannels = (): Channel[] => {
  // Create Google Ads channel
  const googleAdsChannel = createEmptyChannel("Google Ads")
  const googleAdsGroup = googleAdsChannel.conditionGroups[0]

  // Add UTM Source condition
  googleAdsGroup.conditions[0] = {
    id: generateId(),
    property: "UTM_Source",
    conditionType: "is in list",
    value: '["google", "Google"]',
  }

  // Add UTM Medium condition
  googleAdsGroup.conditions.push({
    id: generateId(),
    property: "UTM_Medium",
    conditionType: "is in list",
    value: '["cpc", "ppc", "paidsearch"]',
  })

  // Set the operator to AND
  googleAdsGroup.operator = "AND"

  // Create a group for Google Ads click IDs (replace the old referrer group)
  const googleAdsClickIdGroup = createEmptyConditionGroup()
  googleAdsClickIdGroup.operator = "OR"

  // Add combined gclid/gbraid detection in Current_URL
  googleAdsClickIdGroup.conditions[0] = {
    id: generateId(),
    property: "Current_URL",
    conditionType: "matches regex",
    value: "[?&](gclid=|gbraid=)",
  }

  // Add combined gclid/gbraid detection in Referrer
  googleAdsClickIdGroup.conditions.push({
    id: generateId(),
    property: "Referrer",
    conditionType: "matches regex",
    value: "[?&](gclid=|gbraid=)",
  })

  // Replace the old referrer group
  googleAdsChannel.conditionGroups[1] = googleAdsClickIdGroup

  // Create Google Display Network channel
  const googleDisplayChannel = createEmptyChannel("Google Display Network")
  const googleDisplayGroup = googleDisplayChannel.conditionGroups[0]

  // Add UTM Source condition
  googleDisplayGroup.conditions[0] = {
    id: generateId(),
    property: "UTM_Source",
    conditionType: "is in list",
    value: '["google", "Google"]',
  }

  // Add UTM Medium condition for display
  googleDisplayGroup.conditions.push({
    id: generateId(),
    property: "UTM_Medium",
    conditionType: "is in list",
    value: '["display", "banner", "cpm"]',
  })

  // Set the operator to AND
  googleDisplayGroup.operator = "AND"

  // Create a group for dclid detection
  const googleDisplayClickIdGroup = createEmptyConditionGroup()
  googleDisplayClickIdGroup.operator = "OR"

  // Add dclid detection in Current_URL
  googleDisplayClickIdGroup.conditions[0] = {
    id: generateId(),
    property: "Current_URL",
    conditionType: "matches regex",
    value: "[?&]dclid=",
  }

  // Add dclid detection in Referrer
  googleDisplayClickIdGroup.conditions.push({
    id: generateId(),
    property: "Referrer",
    conditionType: "matches regex",
    value: "[?&]dclid=",
  })

  // Add the click ID group to Google Display Network channel
  googleDisplayChannel.conditionGroups.push(googleDisplayClickIdGroup)

  // Create Bing Ads channel
  const bingAdsChannel = createEmptyChannel("Bing Ads")
  const bingAdsGroup = bingAdsChannel.conditionGroups[0]

  // Add UTM Source condition
  bingAdsGroup.conditions[0] = {
    id: generateId(),
    property: "UTM_Source",
    conditionType: "is in list",
    value: '["bing"]',
  }

  // Add UTM Medium condition
  bingAdsGroup.conditions.push({
    id: generateId(),
    property: "UTM_Medium",
    conditionType: "is in list",
    value: '["cpc", "ppc", "paidsearch"]',
  })

  // Set the operator to AND
  bingAdsGroup.operator = "AND"

  // Create a group for msclkid detection
  const bingAdsClickIdGroup = createEmptyConditionGroup()
  bingAdsClickIdGroup.operator = "OR"

  // Add msclkid detection in Current_URL
  bingAdsClickIdGroup.conditions[0] = {
    id: generateId(),
    property: "Current_URL",
    conditionType: "matches regex",
    value: "[?&]msclkid=",
  }

  // Add msclkid detection in Referrer
  bingAdsClickIdGroup.conditions.push({
    id: generateId(),
    property: "Referrer",
    conditionType: "matches regex",
    value: "[?&]msclkid=",
  })

  // Add the click ID group to Bing Ads channel
  bingAdsChannel.conditionGroups.push(bingAdsClickIdGroup)

  // Create Facebook Ads channel
  const facebookAdsChannel = createEmptyChannel("Facebook Ads")
  const facebookAdsGroup = facebookAdsChannel.conditionGroups[0]

  // Add UTM Source condition
  facebookAdsGroup.conditions[0] = {
    id: generateId(),
    property: "UTM_Source",
    conditionType: "is in list",
    value: '["facebook", "Facebook", "fb", "msg", "an"]',
  }

  // Add UTM Medium condition
  facebookAdsGroup.conditions.push({
    id: generateId(),
    property: "UTM_Medium",
    conditionType: "is in list",
    value: '["cpc", "ppc", "paidsearch"]',
  })

  // Set the operator to AND
  facebookAdsGroup.operator = "AND"

  // Create the Facebook Ads referrer group
  const facebookAdsReferrerGroup = createEmptyConditionGroup()
  facebookAdsReferrerGroup.operator = "OR"

  // Add UTM_Source condition for Facebook referrer fallback
  facebookAdsReferrerGroup.conditions[0] = {
    id: generateId(),
    property: "UTM_Source",
    conditionType: "is in list",
    value: '["facebook", "Facebook", "fb", "msg", "an"]',
  }

  // Add regex match for fbclid in referrer
  facebookAdsReferrerGroup.conditions.push({
    id: generateId(),
    property: "Referrer",
    conditionType: "matches regex",
    value: "fbclid",
  })

  // Add the referrer group to Facebook Ads channel
  facebookAdsChannel.conditionGroups.push(facebookAdsReferrerGroup)

  // Create a third group for Facebook Ads click IDs
  const facebookAdsClickIdGroup = createEmptyConditionGroup()
  facebookAdsClickIdGroup.operator = "OR"

  // Add fbclid detection in Current_URL
  facebookAdsClickIdGroup.conditions[0] = {
    id: generateId(),
    property: "Current_URL",
    conditionType: "matches regex",
    value: "[?&]fbclid=",
  }

  // Add fbclid detection in Referrer
  facebookAdsClickIdGroup.conditions.push({
    id: generateId(),
    property: "Referrer",
    conditionType: "matches regex",
    value: "[?&]fbclid=",
  })

  // Add the click ID group to Facebook Ads channel
  facebookAdsChannel.conditionGroups.push(facebookAdsClickIdGroup)

  // Create Twitter Ads channel
  const xAdsChannel = createEmptyChannel("X Ads")
  const xAdsGroup = xAdsChannel.conditionGroups[0]

  // Add UTM Source condition
  xAdsGroup.conditions[0] = {
    id: generateId(),
    property: "UTM_Source",
    conditionType: "is in list",
    value: '["twitter", "Twitter", "x.com"]',
  }

  // Add UTM Medium condition
  xAdsGroup.conditions.push({
    id: generateId(),
    property: "UTM_Medium",
    conditionType: "is in list",
    value: '["cpc", "ppc", "paidsearch"]',
  })

  // Set the operator to AND
  xAdsGroup.operator = "AND"

  // Create a group for twclid detection
  const xAdsClickIdGroup = createEmptyConditionGroup()
  xAdsClickIdGroup.operator = "OR"

  // Add twclid detection in Current_URL
  xAdsClickIdGroup.conditions[0] = {
    id: generateId(),
    property: "Current_URL",
    conditionType: "matches regex",
    value: "[?&]twclid=",
  }

  // Add twclid detection in Referrer
  xAdsClickIdGroup.conditions.push({
    id: generateId(),
    property: "Referrer",
    conditionType: "matches regex",
    value: "[?&]twclid=",
  })

  // Add the click ID group to Twitter Ads channel
  xAdsChannel.conditionGroups.push(xAdsClickIdGroup)

  // Create TikTok Ads channel
  const tiktokAdsChannel = createEmptyChannel("TikTok Ads")
  const tiktokAdsGroup = tiktokAdsChannel.conditionGroups[0]

  // Add UTM Source condition
  tiktokAdsGroup.conditions[0] = {
    id: generateId(),
    property: "UTM_Source",
    conditionType: "is in list",
    value: '["tiktok", "TikTok"]',
  }

  // Add UTM Medium condition
  tiktokAdsGroup.conditions.push({
    id: generateId(),
    property: "UTM_Medium",
    conditionType: "is in list",
    value: '["cpc", "ppc", "paidsearch"]',
  })

  // Set the operator to AND
  tiktokAdsGroup.operator = "AND"

  // Create a group for ttclid detection
  const tiktokAdsClickIdGroup = createEmptyConditionGroup()
  tiktokAdsClickIdGroup.operator = "OR"

  // Add ttclid detection in Current_URL
  tiktokAdsClickIdGroup.conditions[0] = {
    id: generateId(),
    property: "Current_URL",
    conditionType: "matches regex",
    value: "[?&]ttclid=",
  }

  // Add ttclid detection in Referrer
  tiktokAdsClickIdGroup.conditions.push({
    id: generateId(),
    property: "Referrer",
    conditionType: "matches regex",
    value: "[?&]ttclid=",
  })

  // Add the click ID group to TikTok Ads channel
  tiktokAdsChannel.conditionGroups.push(tiktokAdsClickIdGroup)

  // Create Instagram Ads channel
  const instagramAdsChannel = createEmptyChannel("Instagram Ads")
  const instagramAdsGroup = instagramAdsChannel.conditionGroups[0]

  // Add UTM Source condition
  instagramAdsGroup.conditions[0] = {
    id: generateId(),
    property: "UTM_Source",
    conditionType: "is in list",
    value: '["instagram", "Instagram", "ig"]',
  }

  // Add UTM Medium condition
  instagramAdsGroup.conditions.push({
    id: generateId(),
    property: "UTM_Medium",
    conditionType: "is in list",
    value: '["cpc", "ppc", "paidsearch"]',
  })

  // Set the operator to AND
  instagramAdsGroup.operator = "AND"

  // Create a group for igclid detection
  const instagramAdsClickIdGroup = createEmptyConditionGroup()
  instagramAdsClickIdGroup.operator = "OR"

  // Add igclid detection in Current_URL
  instagramAdsClickIdGroup.conditions[0] = {
    id: generateId(),
    property: "Current_URL",
    conditionType: "matches regex",
    value: "[?&]igclid=",
  }

  // Add igclid detection in Referrer
  instagramAdsClickIdGroup.conditions.push({
    id: generateId(),
    property: "Referrer",
    conditionType: "matches regex",
    value: "[?&]igclid=",
  })

  // Add the click ID group to Instagram Ads channel
  instagramAdsChannel.conditionGroups.push(instagramAdsClickIdGroup)

  // Create Pinterest Ads channel
  const pinterestAdsChannel = createEmptyChannel("Pinterest Ads")
  const pinterestAdsGroup = pinterestAdsChannel.conditionGroups[0]

  // Add UTM Source condition
  pinterestAdsGroup.conditions[0] = {
    id: generateId(),
    property: "UTM_Source",
    conditionType: "is in list",
    value: '["pinterest", "Pinterest"]',
  }

  // Add UTM Medium condition
  pinterestAdsGroup.conditions.push({
    id: generateId(),
    property: "UTM_Medium",
    conditionType: "is in list",
    value: '["cpc", "ppc", "paidsearch"]',
  })

  // Set the operator to AND
  pinterestAdsGroup.operator = "AND"

  // Create a group for pclid detection
  const pinterestAdsClickIdGroup = createEmptyConditionGroup()
  pinterestAdsClickIdGroup.operator = "OR"

  // Add pclid detection in Current_URL
  pinterestAdsClickIdGroup.conditions[0] = {
    id: generateId(),
    property: "Current_URL",
    conditionType: "matches regex",
    value: "[?&]pclid=",
  }

  // Add pclid detection in Referrer
  pinterestAdsClickIdGroup.conditions.push({
    id: generateId(),
    property: "Referrer",
    conditionType: "matches regex",
    value: "[?&]pclid=",
  })

  // Add the click ID group to Pinterest Ads channel
  pinterestAdsChannel.conditionGroups.push(pinterestAdsClickIdGroup)

  // Create LinkedIn Ads channel
  const linkedinAdsChannel = createEmptyChannel("LinkedIn Ads")
  const linkedinAdsGroup = linkedinAdsChannel.conditionGroups[0]

  // Add UTM Source condition
  linkedinAdsGroup.conditions[0] = {
    id: generateId(),
    property: "UTM_Source",
    conditionType: "is in list",
    value: '["linkedin", "LinkedIn"]',
  }

  // Add UTM Medium condition
  linkedinAdsGroup.conditions.push({
    id: generateId(),
    property: "UTM_Medium",
    conditionType: "is in list",
    value: '["cpc", "ppc", "paidsearch"]',
  })

  // Set the operator to AND
  linkedinAdsGroup.operator = "AND"

  // Create a group for li_fat_id detection
  const linkedinAdsClickIdGroup = createEmptyConditionGroup()
  linkedinAdsClickIdGroup.operator = "OR"

  // Add li_fat_id detection in Current_URL
  linkedinAdsClickIdGroup.conditions[0] = {
    id: generateId(),
    property: "Current_URL",
    conditionType: "matches regex",
    value: "[?&]li_fat_id=",
  }

  // Add li_fat_id detection in Referrer
  linkedinAdsClickIdGroup.conditions.push({
    id: generateId(),
    property: "Referrer",
    conditionType: "matches regex",
    value: "[?&]li_fat_id=",
  })

  // Add the click ID group to LinkedIn Ads channel
  linkedinAdsChannel.conditionGroups.push(linkedinAdsClickIdGroup)

  // Create LinkedIn Organic channel
  const linkedinOrganicChannel = createEmptyChannel("LinkedIn Organic")
  const linkedinOrganicGroup = linkedinOrganicChannel.conditionGroups[0]

  // Add UTM Source condition
  linkedinOrganicGroup.conditions[0] = {
    id: generateId(),
    property: "UTM_Source",
    conditionType: "is in list",
    value: '["linkedin", "LinkedIn"]',
  }

  // Create LinkedIn Organic domain group
  const linkedinOrganicDomainGroup = createEmptyConditionGroup()

  // Add Referring_Domain condition
  linkedinOrganicDomainGroup.conditions[0] = {
    id: generateId(),
    property: "Referring_Domain",
    conditionType: "is in list",
    value: '["linkedin"]',
  }

  // Add the domain group to LinkedIn Organic channel
  linkedinOrganicChannel.conditionGroups.push(linkedinOrganicDomainGroup)

  // Create Yandex Ads channel
  const yandexAdsChannel = createEmptyChannel("Yandex Ads")
  const yandexAdsGroup = yandexAdsChannel.conditionGroups[0]

  // Add UTM Source condition
  yandexAdsGroup.conditions[0] = {
    id: generateId(),
    property: "UTM_Source",
    conditionType: "is in list",
    value: '["yandex", "Yandex"]',
  }

  // Add UTM Medium condition
  yandexAdsGroup.conditions.push({
    id: generateId(),
    property: "UTM_Medium",
    conditionType: "is in list",
    value: '["cpc", "ppc", "paidsearch"]',
  })

  // Set the operator to AND
  yandexAdsGroup.operator = "AND"

  // Create a group for yclid detection
  const yandexAdsClickIdGroup = createEmptyConditionGroup()
  yandexAdsClickIdGroup.operator = "OR"

  // Add yclid detection in Current_URL
  yandexAdsClickIdGroup.conditions[0] = {
    id: generateId(),
    property: "Current_URL",
    conditionType: "matches regex",
    value: "[?&]yclid=",
  }

  // Add yclid detection in Referrer
  yandexAdsClickIdGroup.conditions.push({
    id: generateId(),
    property: "Referrer",
    conditionType: "matches regex",
    value: "[?&]yclid=",
  })

  // Add the click ID group to Yandex Ads channel
  yandexAdsChannel.conditionGroups.push(yandexAdsClickIdGroup)

  // Create Adobe Advertising Cloud channel
  const adobeAdsChannel = createEmptyChannel("Adobe Advertising Cloud")
  const adobeAdsGroup = adobeAdsChannel.conditionGroups[0]

  // Add ef_id detection in Current_URL
  adobeAdsGroup.conditions[0] = {
    id: generateId(),
    property: "Current_URL",
    conditionType: "matches regex",
    value: "[?&]ef_id=",
  }

  // Add ef_id detection in Referrer
  adobeAdsGroup.conditions.push({
    id: generateId(),
    property: "Referrer",
    conditionType: "matches regex",
    value: "[?&]ef_id=",
  })

  // Set the operator to OR
  adobeAdsGroup.operator = "OR"

  // Create VK Ads channel
  const vkAdsChannel = createEmptyChannel("VK Ads")
  const vkAdsGroup = vkAdsChannel.conditionGroups[0]

  // Add UTM Source condition
  vkAdsGroup.conditions[0] = {
    id: generateId(),
    property: "UTM_Source",
    conditionType: "is in list",
    value: '["vk", "VK", "vkontakte"]',
  }

  // Add UTM Medium condition
  vkAdsGroup.conditions.push({
    id: generateId(),
    property: "UTM_Medium",
    conditionType: "is in list",
    value: '["cpc", "ppc", "paidsearch"]',
  })

  // Set the operator to AND
  vkAdsGroup.operator = "AND"

  // Create a group for vkclid detection
  const vkAdsClickIdGroup = createEmptyConditionGroup()
  vkAdsClickIdGroup.operator = "OR"

  // Add vkclid detection in Current_URL
  vkAdsClickIdGroup.conditions[0] = {
    id: generateId(),
    property: "Current_URL",
    conditionType: "matches regex",
    value: "[?&]vkclid=",
  }

  // Add vkclid detection in Referrer
  vkAdsClickIdGroup.conditions.push({
    id: generateId(),
    property: "Referrer",
    conditionType: "matches regex",
    value: "[?&]vkclid=",
  })

  // Add the click ID group to VK Ads channel
  vkAdsChannel.conditionGroups.push(vkAdsClickIdGroup)

  // Create Mailchimp channel
  const mailchimpChannel = createEmptyChannel("Mailchimp")
  const mailchimpGroup = mailchimpChannel.conditionGroups[0]

  // Add UTM Source condition
  mailchimpGroup.conditions[0] = {
    id: generateId(),
    property: "UTM_Source",
    conditionType: "is in list",
    value: '["mailchimp", "Mailchimp"]',
  }

  // Add UTM Medium condition
  mailchimpGroup.conditions.push({
    id: generateId(),
    property: "UTM_Medium",
    conditionType: "is in list",
    value: '["email", "Email"]',
  })

  // Set the operator to AND
  mailchimpGroup.operator = "AND"

  // Create a group for mc_eid detection
  const mailchimpClickIdGroup = createEmptyConditionGroup()
  mailchimpClickIdGroup.operator = "OR"

  // Add mc_eid detection in Current_URL
  mailchimpClickIdGroup.conditions[0] = {
    id: generateId(),
    property: "Current_URL",
    conditionType: "matches regex",
    value: "[?&]mc_eid=",
  }

  // Add mc_eid detection in Referrer
  mailchimpClickIdGroup.conditions.push({
    id: generateId(),
    property: "Referrer",
    conditionType: "matches regex",
    value: "[?&]mc_eid=",
  })

  // Add the click ID group to Mailchimp channel
  mailchimpChannel.conditionGroups.push(mailchimpClickIdGroup)

  // Keep existing organic channels
  // Create Facebook Organic channel
  const facebookOrganicChannel = createEmptyChannel("Facebook Organic")
  const facebookOrganicGroup = facebookOrganicChannel.conditionGroups[0]

  // Add UTM Source condition
  facebookOrganicGroup.conditions[0] = {
    id: generateId(),
    property: "UTM_Source",
    conditionType: "is in list",
    value: '["facebook", "Facebook", "fb", "msg", "an"]',
  }

  // Add UTM Medium condition
  facebookOrganicGroup.conditions.push({
    id: generateId(),
    property: "UTM_Medium",
    conditionType: "is in list",
    value: '["Facebook_Organic", "organic_post"]',
  })

  // Set the operator to AND
  facebookOrganicGroup.operator = "AND"

  // Create Facebook Organic domain group
  const facebookOrganicDomainGroup = createEmptyConditionGroup()

  // Add Referring_Domain condition
  facebookOrganicDomainGroup.conditions[0] = {
    id: generateId(),
    property: "Referring_Domain",
    conditionType: "is in list",
    value: '["facebook"]',
  }

  // Add the domain group to Facebook Organic channel
  facebookOrganicChannel.conditionGroups.push(facebookOrganicDomainGroup)

  // Create Instagram Organic channel
  const instagramOrganicChannel = createEmptyChannel("Instagram Organic")
  const instagramOrganicGroup = instagramOrganicChannel.conditionGroups[0]

  // Add UTM Source condition
  instagramOrganicGroup.conditions[0] = {
    id: generateId(),
    property: "UTM_Source",
    conditionType: "is in list",
    value: '["instagram", "Instagram", "ig"]',
  }

  // Add UTM Medium condition
  instagramOrganicGroup.conditions.push({
    id: generateId(),
    property: "UTM_Medium",
    conditionType: "is in list",
    value: '["Instagram_Organic"]',
  })

  // Set the operator to AND
  instagramOrganicGroup.operator = "AND"

  // Create Instagram Organic domain group
  const instagramOrganicDomainGroup = createEmptyConditionGroup()

  // Add Referring_Domain condition
  instagramOrganicDomainGroup.conditions[0] = {
    id: generateId(),
    property: "Referring_Domain",
    conditionType: "is in list",
    value: '["instagram"]',
  }

  // Add the domain group to Instagram Organic channel
  instagramOrganicChannel.conditionGroups.push(instagramOrganicDomainGroup)

  // Create Email channel
  const emailChannel = createEmptyChannel("Email")
  const emailGroup = emailChannel.conditionGroups[0]

  // Add UTM Medium condition
  emailGroup.conditions[0] = {
    id: generateId(),
    property: "UTM_Medium",
    conditionType: "is in list",
    value: '["email", "Email", "pdf"]',
  }

  // Create YouTube Organic channel
  const youtubeOrganicChannel = createEmptyChannel("YouTube Organic")
  const youtubeOrganicGroup = youtubeOrganicChannel.conditionGroups[0]

  // Add UTM Source condition
  youtubeOrganicGroup.conditions[0] = {
    id: generateId(),
    property: "UTM_Source",
    conditionType: "is in list",
    value: '["Youtube", "youtube", "yt"]',
  }

  // Add UTM Medium condition
  youtubeOrganicGroup.conditions.push({
    id: generateId(),
    property: "UTM_Medium",
    conditionType: "is in list",
    value: '["Description", "Organtic", "Youtube_Organic"]',
  })

  // Set the operator to AND
  youtubeOrganicGroup.operator = "AND"

  // Create YouTube Organic domain group
  const youtubeOrganicDomainGroup = createEmptyConditionGroup()

  // Add Referring_Domain condition
  youtubeOrganicDomainGroup.conditions[0] = {
    id: generateId(),
    property: "Referring_Domain",
    conditionType: "is in list",
    value: '["youtube"]',
  }

  // Add the domain group to YouTube Organic channel
  youtubeOrganicChannel.conditionGroups.push(youtubeOrganicDomainGroup)

  // Create TikTok Organic channel
  const tiktokOrganicChannel = createEmptyChannel("TikTok Organic")
  const tiktokOrganicGroup = tiktokOrganicChannel.conditionGroups[0]

  // Add UTM Source condition
  tiktokOrganicGroup.conditions[0] = {
    id: generateId(),
    property: "UTM_Source",
    conditionType: "is in list",
    value: '["TikTok", "tiktok"]',
  }

  // Add UTM Medium condition
  tiktokOrganicGroup.conditions.push({
    id: generateId(),
    property: "UTM_Medium",
    conditionType: "is in list",
    value: '["TikTok_Organic"]',
  })

  // Set the operator to AND
  tiktokOrganicGroup.operator = "AND"

  // Create TikTok domain group
  const tiktokOrganicDomainGroup = createEmptyConditionGroup()

  // Add Referring_Domain condition
  tiktokOrganicDomainGroup.conditions[0] = {
    id: generateId(),
    property: "Referring_Domain",
    conditionType: "is in list",
    value: '["tiktok"]',
  }

  // Add the domain group to TikTok Organic channel
  tiktokOrganicChannel.conditionGroups.push(tiktokOrganicDomainGroup)

  // Create Pinterest Organic channel
  const pinterestOrganicChannel = createEmptyChannel("Pinterest Organic")
  const pinterestOrganicGroup = pinterestOrganicChannel.conditionGroups[0]

  // Add Referring_Domain condition
  pinterestOrganicGroup.conditions[0] = {
    id: generateId(),
    property: "Referring_Domain",
    conditionType: "is in list",
    value: '["pinterest"]',
  }

  // Create Pinterest app group
  const pinterestOrganicAppGroup = createEmptyConditionGroup()

  // Add Referring_Domain condition for app
  pinterestOrganicAppGroup.conditions[0] = {
    id: generateId(),
    property: "Referring_Domain",
    conditionType: "is in list",
    value: '["com.pinterest"]',
  }

  // Add the app group to Pinterest Organic channel
  pinterestOrganicChannel.conditionGroups.push(pinterestOrganicAppGroup)

  // Create Reddit channel
  const redditChannel = createEmptyChannel("Reddit")
  const redditGroup = redditChannel.conditionGroups[0]

  // Add Referring_Domain condition
  redditGroup.conditions[0] = {
    id: generateId(),
    property: "Referring_Domain",
    conditionType: "is in list",
    value: '["reddit"]',
  }

  // Create Affiliates channel
  const affiliatesChannel = createEmptyChannel("Affiliates")
  const affiliatesGroup = affiliatesChannel.conditionGroups[0]

  // Add UTM Source condition
  affiliatesGroup.conditions[0] = {
    id: generateId(),
    property: "UTM_Source",
    conditionType: "matches regex",
    value: "af_",
  }

  // Create Forum channel
  const forumChannel = createEmptyChannel("Forum")
  const forumGroup = forumChannel.conditionGroups[0]

  // Add UTM Source condition
  forumGroup.conditions[0] = {
    id: generateId(),
    property: "UTM_Source",
    conditionType: "is in list",
    value: '["forum"]',
  }

  // Add UTM Medium condition
  forumGroup.conditions.push({
    id: generateId(),
    property: "UTM_Medium",
    conditionType: "is in list",
    value: '["banner"]',
  })

  // Set the operator to AND
  forumGroup.operator = "AND"

  // Create Forum specific group
  const forumSpecificGroup = createEmptyConditionGroup()

  // Add specific forum referrer - change to generic forums pattern
  forumSpecificGroup.conditions[0] = {
    id: generateId(),
    property: "Referrer",
    conditionType: "contains",
    value: "/forums/",
  }

  // Add the specific group to Forum channel
  forumChannel.conditionGroups.push(forumSpecificGroup)

  // Create Internal Traffic channel
  const internalTrafficChannel = createEmptyChannel("Internal Traffic")
  const internalTrafficGroup = internalTrafficChannel.conditionGroups[0]

  // Check if referrer contains the business domain - update domain
  internalTrafficGroup.conditions[0] = {
    id: generateId(),
    property: "Referrer",
    conditionType: "contains",
    value: "pirired.com",
  }

  // Create Direct channel with the new "is not set" condition
  const directChannel = createEmptyChannel("Direct")
  const directGroup = directChannel.conditionGroups[0]

  // Use the new "is not set" condition type
  directGroup.conditions[0] = {
    id: generateId(),
    property: "Referrer",
    conditionType: "is not set",
    value: "", // No value needed for "is not set"
  }

  // Create Google Shopping (Organic) channel
  const googleShoppingOrganicChannel = createEmptyChannel("Google Shopping (Organic)")
  const googleShoppingOrganicGroup = googleShoppingOrganicChannel.conditionGroups[0]

  // Add UTM Source condition
  googleShoppingOrganicGroup.conditions[0] = {
    id: generateId(),
    property: "UTM_Source",
    conditionType: "matches exactly",
    value: "google",
  }

  // Add UTM Medium condition
  googleShoppingOrganicGroup.conditions.push({
    id: generateId(),
    property: "UTM_Medium",
    conditionType: "matches exactly",
    value: "product_sync",
  })

  // Add UTM Campaign condition
  googleShoppingOrganicGroup.conditions.push({
    id: generateId(),
    property: "UTM_Campaign",
    conditionType: "matches exactly",
    value: "sag_organic",
  })

  // Set the operator to AND
  googleShoppingOrganicGroup.operator = "AND"

  // Create Microsoft Shopping (Organic) channel
  const microsoftShoppingOrganicChannel = createEmptyChannel("Microsoft Shopping (Organic)")
  const microsoftShoppingOrganicGroup = microsoftShoppingOrganicChannel.conditionGroups[0]

  // Add UTM Source condition
  microsoftShoppingOrganicGroup.conditions[0] = {
    id: generateId(),
    property: "UTM_Source",
    conditionType: "matches exactly",
    value: "microsoft",
  }

  // Add UTM Medium condition
  microsoftShoppingOrganicGroup.conditions.push({
    id: generateId(),
    property: "UTM_Medium",
    conditionType: "matches exactly",
    value: "product_sync",
  })

  // Add UTM Campaign condition
  microsoftShoppingOrganicGroup.conditions.push({
    id: generateId(),
    property: "UTM_Campaign",
    conditionType: "matches exactly",
    value: "sag_organic",
  })

  // Set the operator to AND
  microsoftShoppingOrganicGroup.operator = "AND"

  // Declare organicSearchChannel and organicSocialChannel
  const organicSearchChannel = createEmptyChannel("Organic Search")
  const organicSocialChannel = createEmptyChannel("Organic Social")

  // Return all created channels, organized by priority (paid ads first, then organic)
  return [
    // Google channels
    googleAdsChannel,
    googleDisplayChannel,

    // Microsoft channels
    bingAdsChannel,

    // Meta channels (Facebook/Instagram)
    facebookAdsChannel,
    facebookOrganicChannel,
    instagramAdsChannel,
    instagramOrganicChannel,

    // Other social platforms
    xAdsChannel,
    tiktokAdsChannel,
    tiktokOrganicChannel,
    youtubeOrganicChannel,

    // Professional/Business platforms
    linkedinAdsChannel,
    linkedinOrganicChannel,
    pinterestAdsChannel,
    pinterestOrganicChannel,

    // International platforms
    yandexAdsChannel,
    vkAdsChannel,

    // Other channels
    adobeAdsChannel,
    mailchimpChannel,
    emailChannel,
    redditChannel,
    affiliatesChannel,
    forumChannel,

    // Shopping channels
    googleShoppingOrganicChannel,
    microsoftShoppingOrganicChannel,

    // Catch-all organic channels
    organicSearchChannel,
    organicSocialChannel,

    // Internal and Direct traffic
    internalTrafficChannel,
    directChannel,
  ]
}
