import{_ as n,c as a,a0 as i,o as e}from"./chunks/framework.ToOB-GtV.js";const u=JSON.parse('{"title":"1.基于Redisson滑动窗口实现验证码发送限流","description":"","frontmatter":{},"headers":[],"relativePath":"practice/limit.md","filePath":"practice/limit.md"}'),p={name:"practice/limit.md"};function t(l,s,r,c,o,d){return e(),a("div",null,s[0]||(s[0]=[i(`<h1 id="_1-基于redisson滑动窗口实现验证码发送限流" tabindex="-1">1.基于Redisson滑动窗口实现验证码发送限流 <a class="header-anchor" href="#_1-基于redisson滑动窗口实现验证码发送限流" aria-label="Permalink to &quot;1.基于Redisson滑动窗口实现验证码发送限流&quot;">​</a></h1><p>短信发送在我们的项目中，主要是登录和注册的时候会做，虽然我们在前端做了控制，短信发送后按钮会置灰，但是后端接口还是要做防控的。</p><p>因为有可能被灰黑产抓包后拿到我们的发送接口，不断的调用。比如一些呼死你的软件，就是到处抓取这种短信接口来实现批量发骚扰短信的目的。如果我们的短信接口没有做好避免重复发送和限流的话，一方面可能会出现资金浪费（因为发短信是需要花钱的），还可能会导致因为投诉而被封。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Component</span></span>
<span class="line"><span>public class SlidingWindowRateLimiter implements RateLimiter {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private RedissonClient redissonClient;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static final String LIMIT_KEY_PREFIX = &quot;auth:limit:&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public SlidingWindowRateLimiter(RedissonClient redissonClient) {</span></span>
<span class="line"><span>        this.redissonClient = redissonClient;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Boolean tryAcquire(String key, int limit, int windowSize) {</span></span>
<span class="line"><span>        RRateLimiter rRateLimiter = redissonClient.getRateLimiter(LIMIT_KEY_PREFIX + key);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (!rRateLimiter.isExists()) {</span></span>
<span class="line"><span>            rRateLimiter.trySetRate(RateType.OVERALL, limit, windowSize, RateIntervalUnit.SECONDS);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return rRateLimiter.tryAcquire();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Boolean access = slidingWindowRateLimiter.tryAcquire(request.getEmail(), 1, 60);</span></span></code></pre></div><p>其中limit为在windowSize时间内，最大的访问次数</p>`,5)]))}const R=n(p,[["render",t]]);export{u as __pageData,R as default};
