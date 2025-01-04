import{_ as s,c as a,a0 as p,o as e}from"./chunks/framework.ToOB-GtV.js";const m=JSON.parse('{"title":"5.基于AOP和token实现防重复提交","description":"","frontmatter":{},"headers":[],"relativePath":"practice/commit.md","filePath":"practice/commit.md"}'),l={name:"practice/commit.md"};function i(t,n,c,o,r,u){return e(),a("div",null,n[0]||(n[0]=[p(`<h1 id="_5-基于aop和token实现防重复提交" tabindex="-1">5.基于AOP和token实现防重复提交 <a class="header-anchor" href="#_5-基于aop和token实现防重复提交" aria-label="Permalink to &quot;5.基于AOP和token实现防重复提交&quot;">​</a></h1><p>在项目中采用了两种方式防止重复提交</p><p>第一种是基于注解的形式，根据请求体中的参数生成一个唯一key存放进redis中，如果set失败，则为重复提交</p><p>第二种是基于token的的形式，请求接口前需要请求一个token，调用接口时携带该token，如果该token不存在则视为重复提交</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Target({ElementType.METHOD, ElementType.PARAMETER, ElementType.FIELD})</span></span>
<span class="line"><span>@Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>@Documented</span></span>
<span class="line"><span>@Inherited</span></span>
<span class="line"><span>public @interface RequestLock {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String prefix() default &quot;&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Redis 锁前缀</span></span>
<span class="line"><span>    long expire() default 30;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 锁时间</span></span>
<span class="line"><span>    TimeUnit timeUnit() default TimeUnit.SECONDS;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 锁时间单位</span></span>
<span class="line"><span>    String delimiter() default &quot;&amp;&quot;;           // key 分隔符</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Target({ElementType.METHOD, ElementType.PARAMETER, ElementType.FIELD})</span></span>
<span class="line"><span>@Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>@Documented</span></span>
<span class="line"><span>@Inherited</span></span>
<span class="line"><span>public @interface RequestKeyParam {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Aspect</span></span>
<span class="line"><span>@Configuration</span></span>
<span class="line"><span>@Order(2)</span></span>
<span class="line"><span>public class RedisRequestLockAspect {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 注入StringRedisTemplate</span></span>
<span class="line"><span>    private final StringRedisTemplate stringRedisTemplate;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    public RedisRequestLockAspect(StringRedisTemplate stringRedisTemplate) {</span></span>
<span class="line"><span>        this.stringRedisTemplate = stringRedisTemplate;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 定义切面，拦截所有带有RequestLock注解的方法</span></span>
<span class="line"><span>    @Around(&quot;execution(public * * (..)) &amp;&amp; @annotation(com.smmisia.article.aop.RequestLock)&quot;)</span></span>
<span class="line"><span>    public Object interceptor(ProceedingJoinPoint joinPoint) {</span></span>
<span class="line"><span>        // 获取方法签名</span></span>
<span class="line"><span>        MethodSignature methodSignature = (MethodSignature)joinPoint.getSignature();</span></span>
<span class="line"><span>        // 获取方法</span></span>
<span class="line"><span>        Method method = methodSignature.getMethod();</span></span>
<span class="line"><span>        // 获取RequestLock注解</span></span>
<span class="line"><span>        RequestLock requestLock = method.getAnnotation(RequestLock.class);</span></span>
<span class="line"><span>        // 判断前缀是否为空</span></span>
<span class="line"><span>        if (StringUtils.isEmpty(requestLock.prefix())) {</span></span>
<span class="line"><span>            return Result.fail(&quot;重复提交前缀不能为空&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 获取自定义key</span></span>
<span class="line"><span>        final String lockKey = RequestKeyGenerator.getLockKey(joinPoint);</span></span>
<span class="line"><span>        // 使用RedisCallback接口执行set命令，设置锁键；设置额外选项：过期时间和SET_IF_ABSENT选项</span></span>
<span class="line"><span>        final Boolean success = stringRedisTemplate.execute(</span></span>
<span class="line"><span>                (RedisCallback&lt;Boolean&gt;) connection -&gt; connection.set(lockKey.getBytes(), new byte[0],</span></span>
<span class="line"><span>                        Expiration.from(requestLock.expire(), requestLock.timeUnit()),</span></span>
<span class="line"><span>                        RedisStringCommands.SetOption.SET_IF_ABSENT));</span></span>
<span class="line"><span>        // 判断是否设置成功</span></span>
<span class="line"><span>        if (!success) {</span></span>
<span class="line"><span>            return Result.fail(&quot;您的操作太快了,请稍后重试&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            // 执行方法</span></span>
<span class="line"><span>            return joinPoint.proceed();</span></span>
<span class="line"><span>        } catch (Throwable throwable) {</span></span>
<span class="line"><span>            return Result.fail(&quot;系统异常&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class RequestKeyGenerator {</span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 获取LockKey</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param joinPoint 切入点</span></span>
<span class="line"><span>     * @return</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public static String getLockKey(ProceedingJoinPoint joinPoint) {</span></span>
<span class="line"><span>        //获取连接点的方法签名对象</span></span>
<span class="line"><span>        MethodSignature methodSignature = (MethodSignature)joinPoint.getSignature();</span></span>
<span class="line"><span>        //Method对象</span></span>
<span class="line"><span>        Method method = methodSignature.getMethod();</span></span>
<span class="line"><span>        //获取Method对象上的注解对象</span></span>
<span class="line"><span>        RequestLock requestLock = method.getAnnotation(RequestLock.class);</span></span>
<span class="line"><span>        //获取方法参数</span></span>
<span class="line"><span>        final Object[] args = joinPoint.getArgs();</span></span>
<span class="line"><span>        //获取Method对象上所有的注解</span></span>
<span class="line"><span>        final Parameter[] parameters = method.getParameters();</span></span>
<span class="line"><span>        StringBuilder sb = new StringBuilder();</span></span>
<span class="line"><span>        for (int i = 0; i &lt; parameters.length; i++) {</span></span>
<span class="line"><span>            final RequestKeyParam keyParam = parameters[i].getAnnotation(RequestKeyParam.class);</span></span>
<span class="line"><span>            //如果属性不是RequestKeyParam注解，则不处理</span></span>
<span class="line"><span>            if (keyParam == null) {</span></span>
<span class="line"><span>                continue;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            //如果属性是RequestKeyParam注解，则拼接 连接符 &quot;&amp; + RequestKeyParam&quot;</span></span>
<span class="line"><span>            sb.append(requestLock.delimiter()).append(args[i]);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        //如果方法上没有加RequestKeyParam注解</span></span>
<span class="line"><span>        if (StringUtils.isEmpty(sb.toString())) {</span></span>
<span class="line"><span>            //获取方法上的多个注解（为什么是两层数组：因为第二层数组是只有一个元素的数组）</span></span>
<span class="line"><span>            final Annotation[][] parameterAnnotations = method.getParameterAnnotations();</span></span>
<span class="line"><span>            //循环注解</span></span>
<span class="line"><span>            for (int i = 0; i &lt; parameterAnnotations.length; i++) {</span></span>
<span class="line"><span>                final Object object = args[i];</span></span>
<span class="line"><span>                //获取注解类中所有的属性字段</span></span>
<span class="line"><span>                final Field[] fields = object.getClass().getDeclaredFields();</span></span>
<span class="line"><span>                for (Field field : fields) {</span></span>
<span class="line"><span>                    //判断字段上是否有RequestKeyParam注解</span></span>
<span class="line"><span>                    final RequestKeyParam annotation = field.getAnnotation(RequestKeyParam.class);</span></span>
<span class="line"><span>                    //如果没有，跳过</span></span>
<span class="line"><span>                    if (annotation == null) {</span></span>
<span class="line"><span>                        continue;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    //如果有，设置Accessible为true（为true时可以使用反射访问私有变量，否则不能访问私有变量）</span></span>
<span class="line"><span>                    field.setAccessible(true);</span></span>
<span class="line"><span>                    //如果属性是RequestKeyParam注解，则拼接 连接符&quot; &amp; + RequestKeyParam&quot;</span></span>
<span class="line"><span>                    sb.append(requestLock.delimiter()).append(ReflectionUtils.getField(field, object));</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        //返回指定前缀的key</span></span>
<span class="line"><span>        return requestLock.prefix() + sb;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,8)]))}const g=s(l,[["render",i]]);export{m as __pageData,g as default};
