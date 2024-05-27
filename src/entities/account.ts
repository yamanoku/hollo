import xss from "xss";
import type { Account, AccountOwner } from "../schema";

export function serializeAccount(account: Account, baseUrl: URL | string) {
  const username = account.handle.replaceAll(/(?:^@)|(?:@[^@]+$)/g, "");
  const defaultAvatarUrl = new URL("/image/default_avatar", baseUrl).href;
  return {
    id: account.id,
    username,
    acct: account.handle.replace(/^@/, ""),
    display_name: account.name,
    locked: account.protected,
    bot: account.type === "Application" || account.type === "Service",
    created_at: account.published ?? account.updated,
    note: xss(account.bioHtml ?? ""),
    url: account.url ?? account.iri,
    avatar: account.avatarUrl ?? defaultAvatarUrl,
    avatar_static: account.avatarUrl ?? defaultAvatarUrl,
    header: account.coverUrl,
    header_static: account.coverUrl,
    followers_count: account.followersCount,
    following_count: account.followingCount,
    statuses_count: account.postsCount,
    last_status_at: null,
    emojis: [],
    fields: Object.entries(account.fieldHtmls).map(([name, value]) => ({
      name,
      value,
      verified_at: null,
    })),
  };
}

export function serializeAccountOwner(
  accountOwner: AccountOwner & { account: Account },
  baseUrl: URL | string,
) {
  return {
    ...serializeAccount(accountOwner.account, baseUrl),
    source: accountOwner && {
      note: accountOwner.bio,
      privacy: accountOwner.visibility,
      sensitive: accountOwner.account.sensitive,
      language: accountOwner.language,
      follow_requests_count: 0,
      fields: Object.entries(accountOwner.fields).map(([name, value]) => ({
        name,
        value,
        verified_at: null,
      })),
    },
  };
}
